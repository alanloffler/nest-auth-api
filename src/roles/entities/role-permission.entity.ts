import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Permission } from "@permissions/entities/permission.entity";
import { Role } from "@roles/entities/role.entity";

@Entity("role_permissions")
export class RolePermission {
  @PrimaryColumn("uuid", { name: "role_id" })
  roleId: string;

  @PrimaryColumn("uuid", { name: "permission_id" })
  permissionId: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;

  @ManyToOne(() => Role, (role) => role.rolePermissions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "role_id" })
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions, { onDelete: "CASCADE", eager: true })
  @JoinColumn({ name: "permission_id" })
  permission: Permission;
}
