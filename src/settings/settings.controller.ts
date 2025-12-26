import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";

import { CreateSettingDto } from "@settings/dto/create-setting.dto";
import { EModule } from "@common/enums/module.enum";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { ParseModulePipe } from "@common/pipes/parse-module.pipe";
import { PermissionsGuard } from "@auth/guards/permissions.guard";
import { RequiredPermissions } from "@auth/decorators/required-permissions.decorator";
import { SettingsService } from "@settings/settings.service";
import { UpdateSettingDto } from "@settings/dto/update-setting.dto";

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller("settings")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @RequiredPermissions("settings-create")
  @Post()
  create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingsService.create(createSettingDto);
  }

  @RequiredPermissions("settings-view")
  @Get()
  findAll() {
    return this.settingsService.findAll();
  }

  @RequiredPermissions("settings-view")
  @Get("by-module/:module")
  findByModule(@Param("module", ParseModulePipe) module: string) {
    return this.settingsService.findByModule(module as EModule);
  }

  @RequiredPermissions("settings-view")
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.settingsService.findOne(id);
  }

  @RequiredPermissions("settings-update")
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.update(id, updateSettingDto);
  }

  @RequiredPermissions("settings-delete-hard")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.settingsService.remove(id);
  }
}
