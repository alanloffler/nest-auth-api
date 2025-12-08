import { MigrationInterface, QueryRunner } from "typeorm";

export class PermissionsDateColumns1765167648911 implements MigrationInterface {
    name = 'PermissionsDateColumns1765167648911'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "permission" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "permission" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "created_at"`);
    }

}
