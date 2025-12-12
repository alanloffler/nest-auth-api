import { CacheModule } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AdminModule } from "@admin/admin.module";
import { AuthController } from "@auth/auth.controller";
import { AuthService } from "@auth/auth.service";
import { JwtRefreshStrategy } from "@auth/strategies/jwt-refresh.strategy";
import { JwtStrategy } from "@auth/strategies/jwt.strategy";
import { LocalStrategy } from "@auth/strategies/local.strategy";
import { PermissionsGuard } from "@auth/guards/permissions.guard";
import { Role } from "@roles/entities/role.entity";

@Module({
  imports: [
    AdminModule,
    CacheModule.register({
      ttl: 0,
      max: 1000,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.get<any>("JWT_EXPIRES_IN") || "7d",
        },
      }),
    }),
    PassportModule,
    TypeOrmModule.forFeature([Role]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, LocalStrategy, PermissionsGuard],
  exports: [PermissionsGuard],
})
export class AuthModule {}
