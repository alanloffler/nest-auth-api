import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Permission } from "./entities/permission.entity";
import { Repository } from "typeorm";
import { ApiResponse } from "@/common/helpers/api-response.helper";

export interface GroupedPermission {
  id: string;
  name: string;
  module: string;
  actions: {
    id: string;
    name: string;
    key: string;
    value: boolean;
  }[];
}

@Injectable()
export class PermissionsService {
  constructor(@InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const permissionDto = {
      ...createPermissionDto,
      actionKey: `${createPermissionDto.category}-${createPermissionDto.actionKey}`,
    };

    const checkExists = await this.permissionRepository.findOne({
      where: { actionKey: permissionDto.actionKey },
    });
    if (checkExists) throw new HttpException("Permiso ya registrado", HttpStatus.BAD_REQUEST);

    const permission = this.permissionRepository.create(permissionDto);
    const savePermission = await this.permissionRepository.save(permission);

    if (!savePermission) throw new HttpException("Error al crear permiso", HttpStatus.BAD_REQUEST);

    return ApiResponse.created<Permission>("Permiso creado", savePermission);
  }

  async findAll(): Promise<ApiResponse<Permission[]>> {
    const permissions = await this.permissionRepository.find();
    if (!permissions) throw new HttpException("Permisos no encontrados", HttpStatus.NOT_FOUND);

    return ApiResponse.success<Permission[]>("Permisos encontrados", permissions);
  }

  async findAllGrouped(): Promise<ApiResponse<GroupedPermission[]>> {
    const permissions = await this.permissionRepository.find();

    // Agrupar por category
    const grouped = permissions.reduce(
      (acc, permission) => {
        if (!acc[permission.category]) {
          acc[permission.category] = [];
        }
        acc[permission.category].push(permission);
        return acc;
      },
      {} as Record<string, typeof permissions>,
    );

    // Transformar a la estructura deseada
    const data = Object.entries(grouped).map(([category, perms]) => ({
      id: perms[0].id, // Usar el ID del primer permiso, o genera uno nuevo si prefieres
      name: this.getCategoryName(category),
      module: category,
      actions: perms.map((p) => ({
        id: p.id,
        name: p.name,
        key: p.actionKey,
        value: false,
      })),
    }));

    return ApiResponse.success<GroupedPermission[]>("Permisos encontrados", data);
  }

  // Método auxiliar para convertir category a nombre legible
  private getCategoryName(category: string): string {
    const categoryNames: Record<string, string> = {
      admin: "Administradores",
      roles: "Roles",
      // Agrega más categorías según necesites
    };

    return categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
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
