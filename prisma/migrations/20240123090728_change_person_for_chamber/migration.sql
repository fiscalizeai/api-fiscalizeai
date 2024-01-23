/*
  Warnings:

  - You are about to drop the `person_data` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "person_data" DROP CONSTRAINT "person_data_city_id_fkey";

-- DropForeignKey
ALTER TABLE "person_data" DROP CONSTRAINT "person_data_user_id_fkey";

-- DropTable
DROP TABLE "person_data";

-- CreateTable
CREATE TABLE "chamber_data" (
    "id" TEXT NOT NULL,
    "staffs" INTEGER NOT NULL,
    "contractors" INTEGER NOT NULL,
    "headcounts" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,

    CONSTRAINT "chamber_data_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "chamber_data" ADD CONSTRAINT "chamber_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chamber_data" ADD CONSTRAINT "chamber_data_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
