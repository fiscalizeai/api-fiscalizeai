-- DropForeignKey
ALTER TABLE "education_data" DROP CONSTRAINT "education_data_user_id_fkey";

-- DropForeignKey
ALTER TABLE "finances_data" DROP CONSTRAINT "finances_data_user_id_fkey";

-- DropForeignKey
ALTER TABLE "health_data" DROP CONSTRAINT "health_data_user_id_fkey";

-- DropForeignKey
ALTER TABLE "transport_data" DROP CONSTRAINT "transport_data_user_id_fkey";

-- AddForeignKey
ALTER TABLE "education_data" ADD CONSTRAINT "education_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_data" ADD CONSTRAINT "health_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finances_data" ADD CONSTRAINT "finances_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_data" ADD CONSTRAINT "transport_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
