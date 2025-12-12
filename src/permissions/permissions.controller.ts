import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";

import { CreatePermissionDto } from "@permissions/dto/create-permission.dto";
import { ERole } from "@common/enums/role.enum";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "@auth/guards/permissions.guard";
import { PermissionsService } from "@permissions/permissions.service";
import { Roles } from "@auth/decorators/roles.decorator";
import { RolesGuard } from "@auth/guards/roles.guard";
import { UpdatePermissionDto } from "@permissions/dto/update-permission.dto";

@UseGuards(JwtAuthGuard, PermissionsGuard, RolesGuard)
@Controller("permissions")
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Roles([ERole.Superadmin])
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Roles([ERole.Superadmin, ERole.Admin])
  @Get()
  findAll() {
    return this.permissionsService.findAll();
  }

  @Roles([ERole.Superadmin, ERole.Admin])
  @Get("grouped")
  findAllGrouped() {
    return this.permissionsService.findAllGrouped();
  }

  @Roles([ERole.Superadmin, ERole.Admin])
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.permissionsService.findOne(id);
  }

  @Roles([ERole.Superadmin, ERole.Admin])
  @Patch(":id")
  update(@Param("id") id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.permissionsService.remove(id);
  }
}
