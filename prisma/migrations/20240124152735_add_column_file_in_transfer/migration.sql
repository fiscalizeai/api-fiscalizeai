/*
  Warnings:

  - Added the required column `file` to the `transfers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transfers" ADD COLUMN     "file" TEXT NOT NULL;
