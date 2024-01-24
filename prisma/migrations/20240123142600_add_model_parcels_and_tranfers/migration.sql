/*
  Warnings:

  - You are about to drop the `Transport` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transport" DROP CONSTRAINT "Transport_city_id_fkey";

-- DropForeignKey
ALTER TABLE "Transport" DROP CONSTRAINT "Transport_user_id_fkey";

-- DropTable
DROP TABLE "Transport";

-- CreateTable
CREATE TABLE "transport_data" (
    "id" TEXT NOT NULL,
    "cars" INTEGER NOT NULL,
    "bus" INTEGER NOT NULL,
    "machines" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,

    CONSTRAINT "transport_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parcels" (
    "id" TEXT NOT NULL,
    "parcel" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "transfer_id" TEXT NOT NULL,

    CONSTRAINT "parcels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transfers" (
    "id" TEXT NOT NULL,
    "demonstrative" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,

    CONSTRAINT "transfers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transport_data" ADD CONSTRAINT "transport_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_data" ADD CONSTRAINT "transport_data_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcels" ADD CONSTRAINT "parcels_transfer_id_fkey" FOREIGN KEY ("transfer_id") REFERENCES "transfers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
