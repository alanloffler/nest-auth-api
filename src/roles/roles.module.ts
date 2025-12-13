import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Permission } from "@permissions/entities/permission.entity";
import { PermissionsModule } from "@permissions/permissions.module";
import { Role } from "@roles/entities/role.entity";
import { RolePermission } from "@roles/entities/role-permission.entity";
import { RolesController } from "@roles/roles.controller";
import { RolesService } from "@roles/roles.service";

@Module({
  imports: [PermissionsModule, TypeOrmModule.forFeature([Permission, Role, RolePermission])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesModule],
})
export class RolesModule {}
