import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeletedAtToRole1765139223764 implements MigrationInterface {
    name = 'AddDeletedAtToRole1765139223764'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "deleted_at"`);
    }

}
