import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { Permission } from "@permissions/entities/permission.entity";
import { Role } from "@roles/entities/role.entity";

@Entity("role_permissions")
export class RolePermission {
  @PrimaryColumn("uuid", { name: "role_id" })
  roleId: string;

  @PrimaryColumn("uuid", { name: "permission_id" })
  permissionId: string;

  @ManyToOne(() => Role, (role) => role.rolePermissions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "role_id" })
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions, { onDelete: "CASCADE", eager: true })
  @JoinColumn({ name: "permission_id" })
  permission: Permission;
}
