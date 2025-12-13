import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from "@nestjs/common";

import { AdminService } from "@admin/admin.service";
import { CreateAdminDto } from "@admin/dto/create-admin.dto";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "@auth/guards/permissions.guard";
import { RequiredPermissions } from "@auth/decorators/required-permissions.decorator";
import { UpdateAdminDto } from "@admin/dto/update-admin.dto";

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @RequiredPermissions("admin-create")
  @Post()
  create(@Body() admin: CreateAdminDto) {
    return this.adminService.create(admin);
  }

  @RequiredPermissions("admin-view")
  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @RequiredPermissions("admin-view")
  @Get("soft-removed")
  findAllSoftRemoved() {
    return this.adminService.findAllSoftRemoved();
  }

  @RequiredPermissions("admin-view")
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.adminService.findOne(id);
  }

  @RequiredPermissions("admin-view")
  @Get(":id/soft-removed")
  findOneSoftRemoved(@Param("id", ParseUUIDPipe) id: string) {
    return this.adminService.findOneSoftRemoved(id);
  }

  @RequiredPermissions("admin-view")
  @Get(":id/credentials")
  findOneWithCredentials(@Param("id", ParseUUIDPipe) id: string) {
    return this.adminService.findOneWithCredentials(id);
  }

  @RequiredPermissions("admin-update")
  @Patch(":id")
  update(@Param("id", ParseUUIDPipe) id: string, @Body() admin: UpdateAdminDto) {
    return this.adminService.update(id, admin);
  }

  @RequiredPermissions("admin-delete")
  @Delete("soft-remove/:id")
  softRemove(@Param("id", ParseUUIDPipe) id: string) {
    return this.adminService.softRemove(id);
  }

  @RequiredPermissions("admin-delete-hard")
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.adminService.remove(id);
  }

  @RequiredPermissions("admin-restore")
  @Patch("restore/:id")
  restore(@Param("id", ParseUUIDPipe) id: string) {
    return this.adminService.restore(id);
  }

  @RequiredPermissions("admin-create")
  @Get("/ic-availability/:ic")
  checkIcAvailability(@Param("ic") id: string) {
    return this.adminService.checkIcAvailability(id);
  }
}
