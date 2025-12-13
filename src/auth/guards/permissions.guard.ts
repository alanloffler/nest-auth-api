import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Reflector } from "@nestjs/core";
import { Repository } from "typeorm";

import { PERMISSIONS_KEY } from "@auth/decorators/required-permissions.decorator";
import { Role } from "@roles/entities/role.entity";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.roleId) {
      throw new HttpException("No tienes permisos para acceder a este recurso", HttpStatus.FORBIDDEN);
    }

    const userPermissions = await this.getRolePermissions(user.roleId);

    if (!userPermissions || userPermissions.length === 0) {
      throw new HttpException("Tu rol no posee permisos asignados", HttpStatus.FORBIDDEN);
    }

    const hasPermissions = requiredPermissions.some((permission) => userPermissions.includes(permission));

    if (!hasPermissions) {
      throw new HttpException(`El usuario no posee el permiso necesario: ${requiredPermissions}`, HttpStatus.FORBIDDEN);
    }

    return hasPermissions;
  }

  private async getRolePermissions(roleId: string): Promise<string[]> {
    const cacheKey = `role_permissions_${roleId}`;

    let permissions: string[] = (await this.cacheManager.get(cacheKey)) as string[];

    if (!permissions) {
      const role = await this.roleRepository.findOne({
        where: { id: roleId },
        relations: ["rolePermissions", "rolePermissions.permission"],
      });

      if (!role || !role.rolePermissions) {
        return [];
      }

      permissions = role.rolePermissions.map((rp) => rp.permission.actionKey);

      await this.cacheManager.set(cacheKey, permissions);
    }

    return permissions;
  }
}
