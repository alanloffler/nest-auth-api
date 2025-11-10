import type { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import type { IPayload } from "@/auth/interfaces/payload.interface";
import { AdminService } from "@/admin/admin.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(
    configService: ConfigService,
    private readonly adminService: AdminService,
  ) {
    const secret = configService.get<string>("JWT_REFRESH_SECRET");
    if (!secret) throw new HttpException("JWT_REFRESH_SECRET no está definido", HttpStatus.UNAUTHORIZED);

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refreshToken;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: IPayload): Promise<IPayload> {
    try {
      if (!payload) throw new HttpException("Token invalido", HttpStatus.UNAUTHORIZED);

      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) throw new HttpException("Token de refresco no encontrado", HttpStatus.UNAUTHORIZED);

      const admin = await this.adminService.findOne(payload.id);
      if (admin.data?.refreshToken !== refreshToken)
        throw new HttpException("Token de refresco no válido", HttpStatus.UNAUTHORIZED);

      return payload;
    } catch (error) {
      throw new HttpException("Error al validar el token de refresco", HttpStatus.UNAUTHORIZED);
    }
  }
}
