import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { EModule } from "@common/enums/module.enum";
import { ESubmodule } from "@common/enums/submodule.enum";

@Entity()
export class Setting {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: EModule, nullable: false })
  module: EModule;

  @Column({ type: "enum", enum: ESubmodule, nullable: true })
  submodule: ESubmodule;

  @Column({ type: "varchar", length: 100, nullable: false })
  key: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  value: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  title: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
