import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Permission } from "@permissions/entities/permission.entity";
import { PermissionsCacheService } from "@permissions/permissions-cache.service";
import { PermissionsController } from "@permissions/permissions.controller";
import { PermissionsService } from "@permissions/permissions.service";
import { Role } from "@roles/entities/role.entity";

@Module({
  imports: [
    CacheModule.register({
      ttl: 0,
      max: 1000,
    }),
    TypeOrmModule.forFeature([Permission, Role]),
  ],
  controllers: [PermissionsController],
  providers: [PermissionsCacheService, PermissionsService],
  exports: [PermissionsCacheService],
})
export class PermissionsModule {}
