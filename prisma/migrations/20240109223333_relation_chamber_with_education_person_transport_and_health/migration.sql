/*
  Warnings:

  - You are about to drop the column `created_At` on the `chambers` table. All the data in the column will be lost.
  - You are about to drop the column `created_At` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transport" ADD COLUMN     "chamber_id" TEXT,
ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "chambers" DROP COLUMN "created_At",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "education_data" ADD COLUMN     "chamber_id" TEXT,
ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "health_data" ADD COLUMN     "chamber_id" TEXT,
ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "person_data" ADD COLUMN     "chamber_id" TEXT,
ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_At",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "education_data" ADD CONSTRAINT "education_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education_data" ADD CONSTRAINT "education_data_chamber_id_fkey" FOREIGN KEY ("chamber_id") REFERENCES "chambers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_data" ADD CONSTRAINT "person_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_data" ADD CONSTRAINT "person_data_chamber_id_fkey" FOREIGN KEY ("chamber_id") REFERENCES "chambers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_data" ADD CONSTRAINT "health_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_data" ADD CONSTRAINT "health_data_chamber_id_fkey" FOREIGN KEY ("chamber_id") REFERENCES "chambers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transport" ADD CONSTRAINT "Transport_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transport" ADD CONSTRAINT "Transport_chamber_id_fkey" FOREIGN KEY ("chamber_id") REFERENCES "chambers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
