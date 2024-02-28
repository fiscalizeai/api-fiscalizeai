-- DropForeignKey
ALTER TABLE "parcels" DROP CONSTRAINT "parcels_transfer_id_fkey";

-- DropForeignKey
ALTER TABLE "total_transfers" DROP CONSTRAINT "total_transfers_city_id_fkey";

-- DropForeignKey
ALTER TABLE "transfers" DROP CONSTRAINT "transfers_city_id_fkey";

-- AddForeignKey
ALTER TABLE "parcels" ADD CONSTRAINT "parcels_transfer_id_fkey" FOREIGN KEY ("transfer_id") REFERENCES "transfers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "total_transfers" ADD CONSTRAINT "total_transfers_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
