-- CreateTable
CREATE TABLE "finances_data" (
    "id" TEXT NOT NULL,
    "iptu" INTEGER NOT NULL,
    "iss" INTEGER NOT NULL,
    "itbi" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,

    CONSTRAINT "finances_data_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "finances_data" ADD CONSTRAINT "finances_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finances_data" ADD CONSTRAINT "finances_data_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
