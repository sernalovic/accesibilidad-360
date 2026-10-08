import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export interface CategoryOption {
  id: string;
  name: string;
}

export interface CategoryWithUsage extends CategoryOption {
  establishmentCount: number;
}

export class CategoryExistsError extends Error {
  readonly code = "CATEGORY_EXISTS" as const;

  constructor() {
    super("Ya existe una categoría con ese nombre.");
    this.name = "CategoryExistsError";
  }
}

export class CategoryInUseError extends Error {
  readonly code = "CATEGORY_IN_USE" as const;

  constructor() {
    super("No se puede eliminar: la categoría está en uso por establecimientos.");
    this.name = "CategoryInUseError";
  }
}

export class CategoryNotFoundError extends Error {
  readonly code = "CATEGORY_NOT_FOUND" as const;

  constructor() {
    super("La categoría no existe.");
    this.name = "CategoryNotFoundError";
  }
}

// Lista las categorías para el formulario (SPEC-030).
// Orden alfabético estable para el desplegable.
export async function listCategories(): Promise<CategoryOption[]> {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}

// Lista las categorías con su uso para la administración (SPEC-110).
// Orden alfabético.
export async function listCategoriesWithUsage(): Promise<CategoryWithUsage[]> {
  const rows = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      _count: { select: { establishments: true } },
    },
  });
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    establishmentCount: row._count.establishments,
  }));
}

// Crea una categoría (SPEC-110, solo ADMIN verificado en la action).
// El nombre llega ya validado (no vacío) desde la Server Action.
export async function createCategory(name: string): Promise<CategoryOption> {
  const trimmed = name.trim();
  try {
    return await prisma.category.create({
      data: { name: trimmed },
      select: { id: true, name: true },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new CategoryExistsError();
    }
    throw error;
  }
}

// Renombra una categoría (SPEC-110, solo ADMIN verificado en la action).
export async function renameCategory(id: string, name: string): Promise<CategoryOption> {
  const trimmed = name.trim();
  const existing = await prisma.category.findUnique({ where: { id }, select: { id: true } });
  if (!existing) {
    throw new CategoryNotFoundError();
  }
  try {
    return await prisma.category.update({
      where: { id },
      data: { name: trimmed },
      select: { id: true, name: true },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new CategoryExistsError();
    }
    throw error;
  }
}

// Elimina una categoría sin usos (SPEC-110, solo ADMIN verificado).
// Sin borrado en cascada: en uso → CategoryInUseError.
export async function deleteCategory(id: string): Promise<void> {
  const existing = await prisma.category.findUnique({
    where: { id },
    select: { id: true, _count: { select: { establishments: true } } },
  });
  if (!existing) {
    throw new CategoryNotFoundError();
  }
  if (existing._count.establishments > 0) {
    throw new CategoryInUseError();
  }
  await prisma.category.delete({ where: { id } });
}
