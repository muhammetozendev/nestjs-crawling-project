import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaSync1700406930626 implements MigrationInterface {
    name = 'SchemaSync1700406930626'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "result" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "favicon" character varying NOT NULL, CONSTRAINT "PK_c93b145f3c2e95f6d9e21d188e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."url_type_enum" AS ENUM('script', 'stylesheet', 'image')`);
        await queryRunner.query(`CREATE TABLE "url" ("id" SERIAL NOT NULL, "type" "public"."url_type_enum" NOT NULL, "url" character varying NOT NULL, "resultId" integer, CONSTRAINT "PK_7421088122ee64b55556dfc3a91" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "url" ADD CONSTRAINT "FK_b90c848833b79b14581a34b4797" FOREIGN KEY ("resultId") REFERENCES "result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "url" DROP CONSTRAINT "FK_b90c848833b79b14581a34b4797"`);
        await queryRunner.query(`DROP TABLE "url"`);
        await queryRunner.query(`DROP TYPE "public"."url_type_enum"`);
        await queryRunner.query(`DROP TABLE "result"`);
    }

}
