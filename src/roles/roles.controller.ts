import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from "@nestjs/common";

import { CreateRoleDto } from "@roles/dto/create-role.dto";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "@auth/guards/permissions.guard";
import { RequiredPermissions } from "@auth/decorators/required-permissions.decorator";
import { RolesService } from "@roles/roles.service";
import { UpdateRoleDto } from "@roles/dto/update-role.dto";

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller("roles")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @RequiredPermissions("roles-create")
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @RequiredPermissions("roles-view")
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @RequiredPermissions("roles-view")
  @Get("soft-removed")
  findAllSoftRemoved() {
    return this.rolesService.findAllSoftRemoved();
  }

  @RequiredPermissions("roles-view")
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.rolesService.findOne(id);
  }

  @RequiredPermissions("roles-update")
  @Patch(":id")
  update(@Param("id", ParseUUIDPipe) id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @RequiredPermissions("roles-delete-hard")
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.rolesService.remove(id);
  }

  @RequiredPermissions("roles-delete")
  @Delete("soft-remove/:id")
  softRemove(@Param("id", ParseUUIDPipe) id: string) {
    return this.rolesService.softRemove(id);
  }

  @RequiredPermissions("roles-restore")
  @Patch("restore/:id")
  restore(@Param("id", ParseUUIDPipe) id: string) {
    return this.rolesService.restore(id);
  }
}
