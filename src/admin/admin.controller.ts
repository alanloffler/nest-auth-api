import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from "@nestjs/common";

import { AdminService } from "@admin/admin.service";
import { CreateAdminDto } from "@admin/dto/create-admin.dto";
import { ERole } from "@common/enums/role.enum";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { Roles } from "@auth/decorators/roles.decorator";
import { RolesGuard } from "@auth/guards/roles.guard";
import { UpdateAdminDto } from "@admin/dto/update-admin.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles([ERole.Superadmin, ERole.Admin])
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Body() admin: CreateAdminDto) {
    return this.adminService.create(admin);
  }

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Roles([ERole.Teacher])
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.adminService.findOne(id);
  }

  @Roles([ERole.Teacher])
  @Patch(":id")
  update(@Param("id", ParseUUIDPipe) id: string, @Body() admin: UpdateAdminDto) {
    return this.adminService.update(id, admin);
  }

  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.adminService.remove(id);
  }
}
