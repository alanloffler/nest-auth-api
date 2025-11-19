import type { Response } from "express";
import { ConfigService } from "@nestjs/config";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import type { IPayload } from "@auth/interfaces/payload.interface";
import type { IRequest } from "@auth/interfaces/request.interface";
import type { IToken } from "@auth/interfaces/token.interface";
import { AdminService } from "@admin/admin.service";
import { ApiResponse } from "@common/helpers/api-response.helper";

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(req: IRequest, res: Response): Promise<ApiResponse<IPayload>> {
    const payload = {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    };

    const tokens = await this.getTokens(payload);

    await this.updateRefreshToken(payload.id, tokens.refreshToken);

    this.setTokenCookie(res, tokens);

    return ApiResponse.success("Usuario logueado", payload);
  }

  async validateUser(email: string): Promise<IPayload> {
    const user = await this.adminService.findOneByEmail(email);

    if (!user) throw new HttpException("Usuario incorrecto", HttpStatus.NOT_FOUND);

    return {
      id: user.id,
      email: user.email,
      role: user.role.value,
    };
  }

  async validatePassword(email: string, password: string): Promise<boolean> {
    const user = await this.adminService.findOneByEmail(email);

    if (!user) throw new HttpException("Usuario incorrecto", HttpStatus.BAD_REQUEST);
    if (user.password !== password) throw new HttpException("Contraseña incorrecta", HttpStatus.UNAUTHORIZED);

    return true;
  }

  async getTokens(payload: IPayload): Promise<IToken> {
    const sanitizedPayload: IPayload = { ...payload };
    delete sanitizedPayload.exp;
    delete sanitizedPayload.iat;

    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(sanitizedPayload, {
          secret: this.configService.get<string>("JWT_SECRET"),
          expiresIn: this.configService.get("JWT_EXPIRES_IN"),
        }),
        this.jwtService.signAsync(sanitizedPayload, {
          secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
          expiresIn: this.configService.get("JWT_REFRESH_EXPIRES_IN"),
        }),
      ]);

      return { accessToken, refreshToken };
    } catch (error) {
      throw new HttpException("Error al generar tokens", HttpStatus.BAD_REQUEST);
    }
  }

  async updateRefreshToken(id: string, refreshToken: string): Promise<void> {
    const updateToken = await this.adminService.update(id, { refreshToken });
    if (!updateToken) throw new HttpException("Error al actualizar token", HttpStatus.BAD_REQUEST);

    return;
  }

  async signOut(payload: IPayload, res: Response): Promise<ApiResponse<null>> {
    await this.updateRefreshToken(payload.id, "");
    this.clearTokenCookie(res);

    return ApiResponse.success<null>("Deslogueo exitoso", null);
  }

  async refreshToken(payload: IPayload, refreshToken: string, res: Response) {
    const admin = await this.adminService.findOne(payload.id);
    if (!admin.data || !admin.data?.refreshToken)
      throw new HttpException("Token de actualización no existe", HttpStatus.BAD_REQUEST);
    if (admin.data?.refreshToken !== refreshToken)
      throw new HttpException("Token de actualización inválido", HttpStatus.BAD_REQUEST);

    const tokens = await this.getTokens(payload);
    await this.updateRefreshToken(admin.data.id, tokens.refreshToken);

    this.setTokenCookie(res, tokens);

    return ApiResponse.success<IToken>("Actualización de token exitoso", tokens);
  }

  async getAdmin(payload: IPayload) {
    const admin = await this.adminService.getAdmin(payload.id);
    if (!admin) throw new HttpException("Administrador no encontrado", HttpStatus.NOT_FOUND);

    return ApiResponse.success("Administrador encontrado", admin);
  }

  private setTokenCookie(res: Response, tokens: IToken): void {
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: this.getMiliseconds(this.configService.get("JWT_EXPIRES_IN")),
      path: "/",
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: this.getMiliseconds(this.configService.get("JWT_REFRESH_EXPIRES_IN")),
      path: "/",
    });
  }

  private clearTokenCookie(res: Response): void {
    res.cookie("accessToken", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 0,
      path: "/",
    });

    res.cookie("refreshToken", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 0,
      path: "/",
    });
  }

  private getMiliseconds(time: string | undefined): number {
    const match = time?.match(/(\d+)([smhd])/);
    if (!match) return 1000 * 60 * 60;

    const [_, value, unit] = match;
    switch (unit) {
      case "s":
        return parseInt(value) * 1000;
      case "m":
        return parseInt(value) * 1000 * 60;
      case "h":
        return parseInt(value) * 1000 * 60 * 60;
      case "d":
        return parseInt(value) * 1000 * 60 * 60 * 24;
      default:
        return 1000 * 60 * 60;
    }
  }
}
