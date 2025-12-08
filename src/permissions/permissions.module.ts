import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Permission } from "@permissions/entities/permission.entity";
import { PermissionsController } from "@permissions/permissions.controller";
import { PermissionsService } from "@permissions/permissions.service";

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule {}
