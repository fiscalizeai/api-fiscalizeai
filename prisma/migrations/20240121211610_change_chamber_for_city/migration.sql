/*
  Warnings:

  - You are about to drop the column `chamber_id` on the `Transport` table. All the data in the column will be lost.
  - You are about to drop the column `chamber_id` on the `education_data` table. All the data in the column will be lost.
  - You are about to drop the column `chamber_id` on the `health_data` table. All the data in the column will be lost.
  - You are about to drop the column `chamber_id` on the `person_data` table. All the data in the column will be lost.
  - You are about to drop the column `chamber_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `chambers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `city_id` to the `Transport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city_id` to the `education_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city_id` to the `health_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city_id` to the `person_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transport" DROP CONSTRAINT "Transport_chamber_id_fkey";

-- DropForeignKey
ALTER TABLE "education_data" DROP CONSTRAINT "education_data_chamber_id_fkey";

-- DropForeignKey
ALTER TABLE "health_data" DROP CONSTRAINT "health_data_chamber_id_fkey";

-- DropForeignKey
ALTER TABLE "person_data" DROP CONSTRAINT "person_data_chamber_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_chamber_id_fkey";

-- AlterTable
ALTER TABLE "Transport" DROP COLUMN "chamber_id",
ADD COLUMN     "city_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "education_data" DROP COLUMN "chamber_id",
ADD COLUMN     "city_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "health_data" DROP COLUMN "chamber_id",
ADD COLUMN     "city_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "person_data" DROP COLUMN "chamber_id",
ADD COLUMN     "city_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "chamber_id",
ADD COLUMN     "city_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "chambers";

-- CreateTable
CREATE TABLE "citys" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "citys_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "citys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education_data" ADD CONSTRAINT "education_data_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "citys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_data" ADD CONSTRAINT "person_data_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "citys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_data" ADD CONSTRAINT "health_data_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "citys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transport" ADD CONSTRAINT "Transport_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "citys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
