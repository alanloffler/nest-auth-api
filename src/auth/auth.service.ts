import type { Response } from "express";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import type { IPayload } from "@auth/interfaces/payload.interface";
import type { IRequest } from "@auth/interfaces/request.interface";
import { AdminService } from "@/admin/admin.service";
import { ApiResponse } from "@/common/helpers/api-response.helper";

@Injectable()
export class AuthService {
  constructor(private readonly adminService: AdminService) {}

  async signIn(req: IRequest, res: Response) {
    // console.log(req.user);
    // console.log(res);
    // TODO: Implement token generation and send it as cookie to client in res
    return ApiResponse.success("Usuario logueado", req.user);
  }

  async validateUser(email: string): Promise<IPayload> {
    const user = await this.adminService.findOneByEmail(email);

    return {
      id: user.id,
      email: user.email,
      role: user.role.value,
    };
  }

  async validatePassword(email: string, password: string): Promise<IPayload> {
    const user = await this.adminService.findOneByEmail(email);

    if (!user || !user.password || user.password !== password) {
      throw new HttpException("Contraseña incorrecta", HttpStatus.UNAUTHORIZED);
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role.value,
    };
  }
}
