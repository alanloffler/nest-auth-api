import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";

import type { IPayload } from "@auth/interfaces/payload.interface";
import { AuthService } from "@auth/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: "email",
      passwordField: "password",
    });
  }

  async validate(email: string, password: string): Promise<IPayload> {
    const user = await this.authService.validateUser(email);

    await this.authService.validatePassword(email, password);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      roleId: user.roleId,
    };
  }
}
