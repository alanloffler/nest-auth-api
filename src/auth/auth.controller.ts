import type { Response } from "express";
import { Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";

import type { IRequest } from "@auth/interfaces/request.interface";
import { AuthService } from "@auth/auth.service";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { JwtRefreshAuthGuard } from "@auth/guards/jwt-refresh-auth";
import { LocalAuthGuard } from "@auth/guards/local-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("signIn")
  signIn(@Req() req: IRequest, @Res({ passthrough: true }) res: Response) {
    return this.authService.signIn(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get("signOut")
  signOut(@Req() req: IRequest, @Res({ passthrough: true }) res: Response) {
    return this.authService.signOut(req.user, res);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post("refreshToken")
  refreshToken(@Req() req: IRequest, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new HttpException("Token de refresco no encontrado", HttpStatus.BAD_REQUEST);

    return this.authService.refreshToken(req.user, refreshToken, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get("admin")
  getAdmin(@Req() req: IRequest) {
    return this.authService.getAdmin(req.user);
  }
}
