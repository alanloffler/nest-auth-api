import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Role } from "@roles/entities/role.entity";

@Entity()
export class Admin {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 8, nullable: false, unique: true })
  ic: string;

  @Column({ type: "varchar", length: 100, name: "user_name", nullable: false })
  userName: string;

  @Column({ type: "varchar", length: 100, name: "first_name", nullable: false })
  firstName: string;

  @Column({ type: "varchar", length: 100, name: "last_name", nullable: false })
  lastName: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  email: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  password: string;

  @Column({ type: "varchar", length: 10, name: "phone_number", nullable: false })
  phoneNumber: string;

  @Column({ type: "uuid", name: "role_id", nullable: false })
  roleId: string;

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: "role_id" })
  role: Role;

  @Column({ type: "text", nullable: true })
  refreshToken: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
