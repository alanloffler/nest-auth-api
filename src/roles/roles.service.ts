import { InjectRepository } from "@nestjs/typeorm";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DataSource, In, Repository } from "typeorm";

import { ApiResponse } from "@common/helpers/api-response.helper";
import { CreateRoleDto } from "@roles/dto/create-role.dto";
import { Permission } from "@permissions/entities/permission.entity";
import { Role } from "@roles/entities/role.entity";
import { RolePermission } from "@roles/entities/role-permission.entity";
import { UpdateRoleDto } from "@roles/dto/update-role.dto";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Permission) private readonly permRepository: Repository<Permission>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(RolePermission) private readonly rolePermRepository: Repository<RolePermission>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<ApiResponse<Role>> {
    await this.roleExists(createRoleDto.value);

    const role = this.roleRepository.create({
      name: createRoleDto.name,
      value: createRoleDto.value,
      description: createRoleDto.description,
    });

    const enabledPermissionIds = createRoleDto.permissions.flatMap((group) =>
      group.actions.filter((a) => a.value).map((a) => a.id),
    );

    const uniqPermissionIds = Array.from(new Set(enabledPermissionIds));

    if (uniqPermissionIds.length === 0) {
      const savedRole = await this.roleRepository.save(role);
      const result = await this.roleRepository.findOne({
        where: { id: savedRole.id },
        relations: ["rolePermissions", "rolePermissions.permission"],
      });

      return ApiResponse.created<Role>("Rol creado", result || undefined);
    }

    const permissions = await this.permRepository.find({
      where: { id: In(uniqPermissionIds) },
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const savedRole = await queryRunner.manager.save(Role, role);
      const rolePermsToInsert = permissions.map((perm) => {
        return this.rolePermRepository.create({
          roleId: savedRole.id,
          permissionId: perm.id,
        });
      });

      await queryRunner.manager.save(RolePermission, rolePermsToInsert);
      await queryRunner.commitTransaction();

      const result = await this.roleRepository.findOne({
        where: { id: savedRole.id },
        relations: ["rolePermissions", "rolePermissions.permission"],
      });

      return ApiResponse.created<Role>("Rol creado", result || undefined);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
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
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ["admins"],
      select: {
        id: true,
        name: true,
        value: true,
        description: true,
        createdAt: true,
        admins: { id: true, firstName: true, lastName: true, userName: true },
      },
    });
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
    const adminsWithRole = await this.roleRepository.findOne({
      where: { id },
      relations: ["admins"],
    });
    if (adminsWithRole && adminsWithRole.admins.length > 0) {
      throw new HttpException(
        `${adminsWithRole.admins.length} ${adminsWithRole.admins.length > 1 ? "usuarios tienen" : "usuario tiene"} este rol. No puedes eliminar un rol con usuarios`,
        HttpStatus.BAD_REQUEST,
      );
    }

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
  private async roleExists(value: string): Promise<void> {
    const role = await this.roleRepository.findOne({ where: { value } });
    if (role) throw new HttpException("El rol ya existe. No puedes repetirlo", HttpStatus.BAD_REQUEST);
  }

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
