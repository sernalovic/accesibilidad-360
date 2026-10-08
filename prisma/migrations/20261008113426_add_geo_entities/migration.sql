-- AlterTable
ALTER TABLE "Establishment" ADD COLUMN     "municipalityId" TEXT,
ADD COLUMN     "provinceId" TEXT,
ALTER COLUMN "municipality" DROP NOT NULL,
ALTER COLUMN "province" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Province" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Province_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Municipality" (
    "id" TEXT NOT NULL,
    "provinceId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Municipality_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Province_code_key" ON "Province"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Province_name_key" ON "Province"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Municipality_code_key" ON "Municipality"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Municipality_provinceId_name_key" ON "Municipality"("provinceId", "name");

-- AddForeignKey
ALTER TABLE "Establishment" ADD CONSTRAINT "Establishment_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "Province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Establishment" ADD CONSTRAINT "Establishment_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "Municipality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Municipality" ADD CONSTRAINT "Municipality_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "Province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

