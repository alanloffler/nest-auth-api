import { MigrationInterface, QueryRunner } from "typeorm";

export class Permissions1765167133617 implements MigrationInterface {
    name = 'Permissions1765167133617'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "category" character varying(100) NOT NULL, "action_key" character varying(100) NOT NULL, "description" character varying(255) NOT NULL, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "permission"`);
    }

}
