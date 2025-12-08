import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Permission } from "./entities/permission.entity";
import { Repository } from "typeorm";
import { ApiResponse } from "@/common/helpers/api-response.helper";

@Injectable()
export class PermissionsService {
  constructor(@InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>) {}

  async create(createPermissionDto: CreatePermissionDto) {
    console.log(createPermissionDto);
    const permission = this.permissionRepository.create(createPermissionDto);
    const savePermission = await this.permissionRepository.save(permission);

    if (!savePermission) throw new HttpException("Error al crear permiso", HttpStatus.BAD_REQUEST);

    return ApiResponse.created<Permission>("Permiso creado", savePermission);
  }

  findAll() {
    return `This action returns all permissions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
