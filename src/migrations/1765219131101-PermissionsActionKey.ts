import { MigrationInterface, QueryRunner } from "typeorm";

export class PermissionsActionKey1765219131101 implements MigrationInterface {
    name = 'PermissionsActionKey1765219131101'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD "action_key" uuid`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_6acb1001d49eaf6841191826b67" FOREIGN KEY ("action_key") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_6acb1001d49eaf6841191826b67"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP COLUMN "action_key"`);
    }

}
