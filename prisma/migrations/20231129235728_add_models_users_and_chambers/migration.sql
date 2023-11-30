-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MEMBER', 'SECRETARY');

-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('ACCEPTED', 'DENIED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "permission" "Permission" NOT NULL DEFAULT 'ACCEPTED',
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "chamberId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chambers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chambers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_chamberId_fkey" FOREIGN KEY ("chamberId") REFERENCES "chambers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
