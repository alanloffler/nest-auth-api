import { InjectRepository } from "@nestjs/typeorm";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

import { ApiResponse } from "@common/helpers/api-response.helper";
import { CreateRoleDto } from "@roles/dto/create-role.dto";
import { Role } from "@roles/entities/role.entity";
import { UpdateRoleDto } from "@roles/dto/update-role.dto";

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>) {}

  async create(createRoleDto: CreateRoleDto): Promise<ApiResponse<Role>> {
    const repeatedRole = await this.roleAlreadyExists(createRoleDto.value);
    if (repeatedRole) throw new HttpException("El rol ya existe", HttpStatus.BAD_REQUEST);

    const role = this.roleRepository.create(createRoleDto);
    const saveRole = await this.roleRepository.save(role);

    if (!saveRole) throw new HttpException("Error al crear rol", HttpStatus.BAD_REQUEST);

    return ApiResponse.created<Role>("Rol creado", saveRole);
  }

  async findAll(): Promise<ApiResponse<Role[]>> {
    const roles = await this.roleRepository.find();
    if (!roles) throw new HttpException("Roles no encontrados", HttpStatus.NOT_FOUND);

    return ApiResponse.success<Role[]>("Roles encontrados", roles);
  }

  async findAllSoftRemoved(): Promise<ApiResponse<Role[]>> {
    const roles = await this.roleRepository.find({ withDeleted: true });
    if (!roles) throw new HttpException("Roles no encontrados", HttpStatus.NOT_FOUND);

    return ApiResponse.success<Role[]>("Roles encontrados", roles);
  }

  async findOne(id: string): Promise<ApiResponse<Role>> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) throw new HttpException("Rol no encontrado", HttpStatus.NOT_FOUND);

    return ApiResponse.success<Role>("Rol encontrado", role);
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<ApiResponse<Role>> {
    const roleToUpdate = await this.findRoleById(id);

    const { value } = updateRoleDto;
    if (value && value !== roleToUpdate.value && (await this.roleAlreadyExists(value))) {
      throw new HttpException("El rol ya existe. No puedes repetirlo", HttpStatus.BAD_REQUEST);
    }

    const result = await this.roleRepository.save({ ...roleToUpdate, ...updateRoleDto });
    if (!result) throw new HttpException("Error al actualizar rol", HttpStatus.BAD_REQUEST);

    return ApiResponse.success<Role>("Rol actualizado", result);
  }

  async remove(id: string): Promise<ApiResponse<Role>> {
    const roleToRemove = await this.findRoleById(id);

    const result = await this.roleRepository.remove(roleToRemove);
    if (!result) throw new HttpException("Error al eliminar rol", HttpStatus.BAD_REQUEST);

    return ApiResponse.success<Role>("Rol eliminado", result);
  }

  async softRemove(id: string): Promise<ApiResponse<Role>> {
    const roleToRemove = await this.findRoleById(id);

    const result = await this.roleRepository.softRemove(roleToRemove);
    if (!result) throw new HttpException("Error al eliminar rol", HttpStatus.BAD_REQUEST);

    return ApiResponse.removed<Role>("Rol eliminado", result);
  }

  async restore(id: string): Promise<ApiResponse<Role>> {
    const roleToRestore = await this.roleRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!roleToRestore) throw new HttpException("Rol no encontrado", HttpStatus.NOT_FOUND);

    const result = await this.roleRepository.restore(roleToRestore.id);
    if (!result) throw new HttpException("Error al restaurar rol", HttpStatus.BAD_REQUEST);

    const restoredAdmin = await this.findRoleById(id);

    return ApiResponse.success<Role>("Rol restaurado", restoredAdmin);
  }

  // Private methods
  private async roleAlreadyExists(value: string): Promise<boolean> {
    const role = await this.roleRepository.findOne({ where: { value } });
    return role ? true : false;
  }

  private async findRoleById(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) throw new HttpException("Rol no encontrado", HttpStatus.NOT_FOUND);

    return role;
  }
}
