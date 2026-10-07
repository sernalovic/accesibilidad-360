import { prisma } from "@/lib/db/prisma";

export interface CategoryOption {
  id: string;
  name: string;
}

// Lista las categorías para el formulario (SPEC-030).
// Orden alfabético estable para el desplegable.
export async function listCategories(): Promise<CategoryOption[]> {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}
