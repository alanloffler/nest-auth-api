import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from "@nestjs/common";

import { AdminService } from "@admin/admin.service";
import { CreateAdminDto } from "@admin/dto/create-admin.dto";
import { ERole } from "@common/enums/role.enum";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { Roles } from "@auth/decorators/roles.decorator";
import { RolesGuard } from "@auth/guards/roles.guard";
import { UpdateAdminDto } from "@admin/dto/update-admin.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles([ERole.Superadmin, ERole.Admin])
  @Post()
  create(@Body() admin: CreateAdminDto) {
    return this.adminService.create(admin);
  }

  @Roles([ERole.Superadmin, ERole.Admin, ERole.Teacher])
  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Roles([ERole.Superadmin])
  @Get("soft-removed")
  findAllSoftRemoved() {
    return this.adminService.findAllSoftRemoved();
  }

  @Roles([ERole.Superadmin, ERole.Admin, ERole.Teacher])
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.adminService.findOne(id);
  }

  @Roles([ERole.Superadmin, ERole.Admin])
  @Get(":id/soft-removed")
  findOneSoftRemoved(@Param("id", ParseUUIDPipe) id: string) {
    return this.adminService.findOneSoftRemoved(id);
  }

  @Roles([ERole.Superadmin, ERole.Admin, ERole.Teacher])
  @Get(":id/credentials")
  findOneWithCredentials(@Param("id", ParseUUIDPipe) id: string) {
    return this.adminService.findOneWithCredentials(id);
  }

  @Roles([ERole.Superadmin, ERole.Admin, ERole.Teacher])
  @Patch(":id")
  update(@Param("id", ParseUUIDPipe) id: string, @Body() admin: UpdateAdminDto) {
    return this.adminService.update(id, admin);
  }

  @Roles([ERole.Superadmin, ERole.Admin])
  @Delete("soft-remove/:id")
  softRemove(@Param("id", ParseUUIDPipe) id: string) {
    return this.adminService.softRemove(id);
  }

  @Roles([ERole.Superadmin])
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.adminService.remove(id);
  }

  @Roles([ERole.Superadmin])
  @Patch("restore/:id")
  restore(@Param("id", ParseUUIDPipe) id: string) {
    return this.adminService.restore(id);
  }

  @Roles([ERole.Superadmin, ERole.Admin])
  @Get("/ic-availability/:ic")
  checkIcAvailability(@Param("ic") id: string) {
    return this.adminService.checkIcAvailability(id);
  }
}
