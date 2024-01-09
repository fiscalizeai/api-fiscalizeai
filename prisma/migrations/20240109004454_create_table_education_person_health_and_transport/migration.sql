-- CreateTable
CREATE TABLE "education_data" (
    "id" TEXT NOT NULL,
    "schools" INTEGER NOT NULL,
    "students" INTEGER NOT NULL,
    "teachers" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "mounth" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "education_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "person_data" (
    "id" TEXT NOT NULL,
    "staffs" INTEGER NOT NULL,
    "contractors" INTEGER NOT NULL,
    "headcounts" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "mounth" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "person_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_data" (
    "id" TEXT NOT NULL,
    "services" INTEGER NOT NULL,
    "doctors" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "mounth" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transport" (
    "id" TEXT NOT NULL,
    "cars" INTEGER NOT NULL,
    "bus" INTEGER NOT NULL,
    "machines" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "mounth" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transport_pkey" PRIMARY KEY ("id")
);
