// Semillas iniciales (SPEC-030 + SPEC-040).
// Categorías y criterios base, idempotentes por nombre (upsert).
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORIES = [
  "Restaurante",
  "Bar",
  "Cafetería",
  "Comercio",
  "Supermercado",
  "Hotel",
  "Centro sanitario",
  "Centro público",
  "Instalación deportiva",
  "Otro",
] as const;

const CRITERIA = [
  "Acceso sin escalones",
  "Puerta accesible",
  "Anchura de paso",
  "Espacio de giro",
  "Aseo adaptado",
  "Ascensor accesible",
  "Aparcamiento PMR",
  "Señalización accesible",
] as const;

async function main(): Promise<void> {
  for (const name of CATEGORIES) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  for (const [index, name] of CRITERIA.entries()) {
    await prisma.criterion.upsert({
      where: { name },
      update: { order: index + 1 },
      create: { name, order: index + 1 },
    });
  }
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
