import type { Response } from "express";
import { Controller, Post, Req, Res } from "@nestjs/common";

import type { IRequest } from "@auth/interfaces/request.interface";
import { AuthService } from "@auth/auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signIn")
  signIn(@Req() req: IRequest, @Res({ passthrough: true }) res: Response) {
    return this.authService.signIn(req, res);
  }
}
