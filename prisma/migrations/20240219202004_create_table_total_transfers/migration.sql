-- CreateTable
CREATE TABLE "total_transfers" (
    "id" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,

    CONSTRAINT "total_transfers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "total_transfers" ADD CONSTRAINT "total_transfers_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
