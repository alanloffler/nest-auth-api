import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Permission } from "@permissions/entities/permission.entity";
import { Role } from "@roles/entities/role.entity";
import { RolePermission } from "@roles/entities/role-permission.entity";
import { Setting } from "@settings/entities/setting.entity";
import { SettingsController } from "@settings/settings.controller";
import { SettingsService } from "@settings/settings.service";

@Module({
  imports: [TypeOrmModule.forFeature([Permission, Role, RolePermission, Setting])],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
