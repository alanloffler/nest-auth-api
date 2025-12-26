import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ApiResponse } from "@common/helpers/api-response.helper";
import { CreateSettingDto } from "@settings/dto/create-setting.dto";
import { Setting } from "@settings/entities/setting.entity";
import { UpdateSettingDto } from "@settings/dto/update-setting.dto";

@Injectable()
export class SettingsService {
  constructor(@InjectRepository(Setting) private readonly settingRepository: Repository<Setting>) {}

  async create(createSettingDto: CreateSettingDto) {
    await this.validateSetting(createSettingDto.key);

    const setting = this.settingRepository.create(createSettingDto);
    const newSetting = await this.settingRepository.save(setting);

    if (!newSetting) throw new HttpException("Error al crear la configuración", HttpStatus.BAD_REQUEST);

    return ApiResponse.created<Setting>("Configuración creada", newSetting);
  }

  async findAll() {
    const settings = await this.settingRepository.find();
    if (!settings) throw new HttpException("Configuraciones no encontradas", HttpStatus.NOT_FOUND);

    return ApiResponse.success<Setting[]>("Configuraciones encontradas", settings);
  }

  async findOne(id: string) {
    const setting = await this.settingRepository.findOne({ where: { id } });
    if (!setting) throw new HttpException("Configuración no encontrada", HttpStatus.NOT_FOUND);

    return ApiResponse.success<Setting>("Configuración encontrada", setting);
  }

  async update(id: string, updateSettingDto: UpdateSettingDto) {
    const settingToUpdate = await this.findOneById(id);

    if (updateSettingDto.key && settingToUpdate.id !== id) await this.validateSetting(updateSettingDto.key);

    const updateSetting = await this.settingRepository.update(id, updateSettingDto);
    if (!updateSetting) throw new HttpException("Error al actualizar la configuración", HttpStatus.BAD_REQUEST);

    const updatedSetting = await this.findOneById(id);

    return ApiResponse.success<Setting>("Configuración actualizada", updatedSetting);
  }

  async remove(id: string) {
    const settingToRemove = await this.findOneById(id);

    const result = await this.settingRepository.remove(settingToRemove);
    if (!result) throw new HttpException("Error al eliminar la configuración", HttpStatus.BAD_REQUEST);

    return ApiResponse.removed<Setting>("Configuración eliminada", result);
  }

  private async findOneById(id: string) {
    const setting = await this.settingRepository.findOne({ where: { id } });
    if (!setting) throw new HttpException("Configuración no encontrada", HttpStatus.NOT_FOUND);

    return setting;
  }

  private async validateSetting(key: string) {
    const settingExists = await this.settingRepository.findOne({ where: { key } });
    if (settingExists) throw new HttpException("La configuración ya existe (clave duplicada)", HttpStatus.BAD_REQUEST);

    return settingExists;
  }
}
