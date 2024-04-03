import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProfileTable1709581048631 implements MigrationInterface {
  name = 'ProfileTable1709581048631';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "PROFILE" ("profile_id" SERIAL NOT NULL, "profile_name" character varying NOT NULL, CONSTRAINT "PK_da8ab863189f21c80e3ba1bc3fd" PRIMARY KEY ("profile_id"))`,
    );

    await queryRunner.query(`INSERT INTO "PROFILE" ("profile_name") VALUES ('Coordenador')`);
    await queryRunner.query(`INSERT INTO "PROFILE" ("profile_name") VALUES ('Técnico')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "PROFILE"`);
  }
}
