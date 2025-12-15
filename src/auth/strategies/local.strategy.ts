import * as bcrypt from "bcrypt";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";

import type { IPayload } from "@auth/interfaces/payload.interface";
import { AdminService } from "@admin/admin.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly adminService: AdminService) {
    super({
      usernameField: "email",
      passwordField: "password",
    });
  }

  async validate(email: string, password: string): Promise<IPayload> {
    const user = await this.adminService.findOneByEmail(email);

    if (!user) throw new HttpException("Credenciales inválidas", HttpStatus.UNAUTHORIZED);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new HttpException("Credenciales inválidas", HttpStatus.UNAUTHORIZED);

    if (!user.role) throw new HttpException("El usuario posee un rol inactivo", HttpStatus.FORBIDDEN);

    return {
      id: user.id,
      email: user.email,
      role: user.role.value,
      roleId: user.role.id,
    };
  }
}
