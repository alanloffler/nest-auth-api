import { MigrationInterface, QueryRunner } from "typeorm";

export class RolePermissionsDates1765242681278 implements MigrationInterface {
    name = 'RolePermissionsDates1765242681278'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP COLUMN "created_at"`);
    }

}
