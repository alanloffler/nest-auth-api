import { SetMetadata } from "@nestjs/common";
import { ERole } from "@common/enums/role.enum";

export const ROLES_KEY: string = "roles";

export const Roles = (roles: ERole[] | null = []) => SetMetadata(ROLES_KEY, roles);
