/*
  Warnings:

  - You are about to drop the column `mounth` on the `Transport` table. All the data in the column will be lost.
  - You are about to drop the column `mounth` on the `education_data` table. All the data in the column will be lost.
  - You are about to drop the column `mounth` on the `health_data` table. All the data in the column will be lost.
  - You are about to drop the column `mounth` on the `person_data` table. All the data in the column will be lost.
  - Added the required column `month` to the `Transport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `month` to the `education_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `month` to the `health_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `month` to the `person_data` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transport" DROP COLUMN "mounth",
ADD COLUMN     "month" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "education_data" DROP COLUMN "mounth",
ADD COLUMN     "month" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "health_data" DROP COLUMN "mounth",
ADD COLUMN     "month" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "person_data" DROP COLUMN "mounth",
ADD COLUMN     "month" TIMESTAMP(3) NOT NULL;
