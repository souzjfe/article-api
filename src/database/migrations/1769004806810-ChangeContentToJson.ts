import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeContentToJson1769004806810 implements MigrationInterface {
  name = 'ChangeContentToJson1769004806810';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "content"`);
    await queryRunner.query(
      `ALTER TABLE "article" ADD "content" json NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "content"`);
    await queryRunner.query(
      `ALTER TABLE "article" ADD "content" text NOT NULL`,
    );
  }
}
