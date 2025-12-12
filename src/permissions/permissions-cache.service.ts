import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class PermissionsCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async invalidateRolePermissions(roleId: string): Promise<void> {
    const cacheKey = `role_permissions_${roleId}`;

    await this.cacheManager.del(cacheKey);
  }

  async invalidateAllRolePermissions(): Promise<void> {
    await (this.cacheManager as any).reset();
  }
}
