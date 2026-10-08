import { prisma } from "@/lib/db/prisma";

export interface CriterionOption {
  id: string;
  name: string;
  description: string | null;
  allowsNotApplicable: boolean;
}

// Lista los criterios en orden de presentación (SPEC-040 + SPEC-045).
export async function listCriteria(): Promise<CriterionOption[]> {
  return prisma.criterion.findMany({
    orderBy: { order: "asc" },
    select: { id: true, name: true, description: true, allowsNotApplicable: true },
  });
}
