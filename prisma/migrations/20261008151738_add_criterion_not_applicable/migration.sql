-- AlterTable
ALTER TABLE "Criterion" ADD COLUMN     "allowsNotApplicable" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "CriterionScore" ALTER COLUMN "score" DROP NOT NULL;

