import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
export class UserTable1709581098769 implements MigrationInterface {
  name = 'UserTable1709581098769';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "USER" ("user_id" SERIAL NOT NULL, "user_name" character varying(200) NOT NULL, "user_email" character varying(200) NOT NULL, "user_password" character varying(200), "user_refresh_token" character varying(200), "user_status" bit NOT NULL, "user_first_access" bit NOT NULL, "profile_id" integer NOT NULL, CONSTRAINT "PK_7e95c49ceadc1951ae0ea829b24" PRIMARY KEY ("user_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "USER" ADD CONSTRAINT "FK_6c1ff6abd2f04a563f93362d69e" FOREIGN KEY ("profile_id") REFERENCES "PROFILE"("profile_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    const adminPassword = await bcrypt.hash('3663', 10);
    await queryRunner.query(`
      INSERT INTO "USER" ("user_name", "user_email", "user_password", "user_status", "user_first_access", "profile_id")
      VALUES ('admin', 'admin@gmail.com', '${adminPassword}', b'1', b'0', 1)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "USER" DROP CONSTRAINT "FK_6c1ff6abd2f04a563f93362d69e"`);
    await queryRunner.query(`DROP TABLE "USER"`);
  }
}
