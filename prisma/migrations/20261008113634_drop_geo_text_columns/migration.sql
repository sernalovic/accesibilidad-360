-- AlterTable
ALTER TABLE "Establishment" DROP COLUMN "municipality",
DROP COLUMN "province",
ALTER COLUMN "municipalityId" SET NOT NULL,
ALTER COLUMN "provinceId" SET NOT NULL;

