import type { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import type { IPayload } from "@auth/interfaces/payload.interface";
import { AdminService } from "@admin/admin.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly adminService: AdminService,
  ) {
    const secret = configService.get<string>("JWT_SECRET");
    if (!secret) throw new Error("JWT_SECRET no está definido");

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.accessToken;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: IPayload) {
    const admin = await this.adminService.findOne(payload.id);
    if (!admin) throw new HttpException("Admin no encontrado", HttpStatus.UNAUTHORIZED);

    return {
      id: admin.data?.id,
      email: admin.data?.email,
      role: admin.data?.role.value,
    };
  }
}
