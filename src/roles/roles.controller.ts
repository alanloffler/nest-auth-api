import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from "@nestjs/common";

import { CreateRoleDto } from "@roles/dto/create-role.dto";
import { ERole } from "@common/enums/role.enum";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { Roles } from "@auth/decorators/roles.decorator";
import { RolesGuard } from "@auth/guards/roles.guard";
import { RolesService } from "@roles/roles.service";
import { UpdateRoleDto } from "@roles/dto/update-role.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles([ERole.Superadmin, ERole.Admin])
@Controller("roles")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get("soft-removed")
  findAllSoftRemoved() {
    return this.rolesService.findAllSoftRemoved();
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id", ParseUUIDPipe) id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.rolesService.remove(id);
  }

  @Roles([ERole.Superadmin, ERole.Admin])
  @Delete("soft-remove/:id")
  softRemove(@Param("id", ParseUUIDPipe) id: string) {
    return this.rolesService.softRemove(id);
  }

  @Roles([ERole.Superadmin])
  @Patch("restore/:id")
  restore(@Param("id", ParseUUIDPipe) id: string) {
    return this.rolesService.restore(id);
  }
}
