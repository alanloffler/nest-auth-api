import { Module } from "@nestjs/common";

import { AdminModule } from "@/admin/admin.module";
import { AuthController } from "@auth/auth.controller";
import { AuthService } from "@auth/auth.service";
import { LocalStrategy } from "@auth/strategies/local.strategy";

@Module({
  imports: [AdminModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
