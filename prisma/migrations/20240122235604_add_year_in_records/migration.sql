/*
  Warnings:

  - Added the required column `year` to the `Transport` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `month` on the `Transport` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `year` to the `education_data` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `month` on the `education_data` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `year` to the `health_data` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `month` on the `health_data` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `year` to the `person_data` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `month` on the `person_data` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Transport" ADD COLUMN     "year" INTEGER NOT NULL,
DROP COLUMN "month",
ADD COLUMN     "month" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "education_data" ADD COLUMN     "year" INTEGER NOT NULL,
DROP COLUMN "month",
ADD COLUMN     "month" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "health_data" ADD COLUMN     "year" INTEGER NOT NULL,
DROP COLUMN "month",
ADD COLUMN     "month" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "person_data" ADD COLUMN     "year" INTEGER NOT NULL,
DROP COLUMN "month",
ADD COLUMN     "month" INTEGER NOT NULL;
