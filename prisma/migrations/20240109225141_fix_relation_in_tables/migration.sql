/*
  Warnings:

  - Made the column `chamber_id` on table `Transport` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `Transport` required. This step will fail if there are existing NULL values in that column.
  - Made the column `chamber_id` on table `education_data` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `education_data` required. This step will fail if there are existing NULL values in that column.
  - Made the column `chamber_id` on table `health_data` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `health_data` required. This step will fail if there are existing NULL values in that column.
  - Made the column `chamber_id` on table `person_data` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `person_data` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Transport" DROP CONSTRAINT "Transport_chamber_id_fkey";

-- DropForeignKey
ALTER TABLE "Transport" DROP CONSTRAINT "Transport_user_id_fkey";

-- DropForeignKey
ALTER TABLE "education_data" DROP CONSTRAINT "education_data_chamber_id_fkey";

-- DropForeignKey
ALTER TABLE "education_data" DROP CONSTRAINT "education_data_user_id_fkey";

-- DropForeignKey
ALTER TABLE "health_data" DROP CONSTRAINT "health_data_chamber_id_fkey";

-- DropForeignKey
ALTER TABLE "health_data" DROP CONSTRAINT "health_data_user_id_fkey";

-- DropForeignKey
ALTER TABLE "person_data" DROP CONSTRAINT "person_data_chamber_id_fkey";

-- DropForeignKey
ALTER TABLE "person_data" DROP CONSTRAINT "person_data_user_id_fkey";

-- AlterTable
ALTER TABLE "Transport" ALTER COLUMN "chamber_id" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "education_data" ALTER COLUMN "chamber_id" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "health_data" ALTER COLUMN "chamber_id" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "person_data" ALTER COLUMN "chamber_id" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "education_data" ADD CONSTRAINT "education_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education_data" ADD CONSTRAINT "education_data_chamber_id_fkey" FOREIGN KEY ("chamber_id") REFERENCES "chambers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_data" ADD CONSTRAINT "person_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_data" ADD CONSTRAINT "person_data_chamber_id_fkey" FOREIGN KEY ("chamber_id") REFERENCES "chambers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_data" ADD CONSTRAINT "health_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_data" ADD CONSTRAINT "health_data_chamber_id_fkey" FOREIGN KEY ("chamber_id") REFERENCES "chambers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transport" ADD CONSTRAINT "Transport_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transport" ADD CONSTRAINT "Transport_chamber_id_fkey" FOREIGN KEY ("chamber_id") REFERENCES "chambers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
