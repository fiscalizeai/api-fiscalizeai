-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MEMBER', 'SECRETARY');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACCEPTED', 'DENIED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" NOT NULL DEFAULT 'ACCEPTED',
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "city_id" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "citys" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "citys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education_data" (
    "id" TEXT NOT NULL,
    "schools" INTEGER NOT NULL,
    "students" INTEGER NOT NULL,
    "teachers" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,

    CONSTRAINT "education_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "person_data" (
    "id" TEXT NOT NULL,
    "staffs" INTEGER NOT NULL,
    "contractors" INTEGER NOT NULL,
    "headcounts" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,

    CONSTRAINT "person_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_data" (
    "id" TEXT NOT NULL,
    "services" INTEGER NOT NULL,
    "doctors" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,

    CONSTRAINT "health_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transport" (
    "id" TEXT NOT NULL,
    "cars" INTEGER NOT NULL,
    "bus" INTEGER NOT NULL,
    "machines" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,

    CONSTRAINT "Transport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "citys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education_data" ADD CONSTRAINT "education_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education_data" ADD CONSTRAINT "education_data_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "citys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_data" ADD CONSTRAINT "person_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_data" ADD CONSTRAINT "person_data_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "citys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_data" ADD CONSTRAINT "health_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_data" ADD CONSTRAINT "health_data_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "citys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transport" ADD CONSTRAINT "Transport_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transport" ADD CONSTRAINT "Transport_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "citys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
