import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeletedAtToUser1764957777517 implements MigrationInterface {
    name = 'AddDeletedAtToUser1764957777517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin" DROP COLUMN "deleted_at"`);
    }

}
