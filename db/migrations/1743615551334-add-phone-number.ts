import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhoneNumber1743615551334 implements MigrationInterface {
    name = 'AddPhoneNumber1743615551334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    }

}
