/*
  Warnings:

  - You are about to drop the column `chamberId` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_chamberId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "chamberId",
ADD COLUMN     "chamber_id" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_chamber_id_fkey" FOREIGN KEY ("chamber_id") REFERENCES "chambers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
