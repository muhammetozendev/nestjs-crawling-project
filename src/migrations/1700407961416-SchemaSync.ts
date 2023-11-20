import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaSync1700407961416 implements MigrationInterface {
    name = 'SchemaSync1700407961416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "result" ADD "jobId" character varying NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_20f29f5521f7076fa1a2f93a3b" ON "result" ("jobId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_20f29f5521f7076fa1a2f93a3b"`);
        await queryRunner.query(`ALTER TABLE "result" DROP COLUMN "jobId"`);
    }

}
