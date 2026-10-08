// Semillas iniciales (SPEC-030 + SPEC-040 + SPEC-035).
// Categorías, criterios, provincias y municipios, idempotentes.
// Provincias: 52 fijas con código oficial INE de 2 dígitos.
// Municipios: `prisma/data/municipalities.json`, convertido del
// dataset oficial del INE "Relación de municipios y sus códigos
// por provincias" (Registro de Entidades Locales), obtenido vía
// API Tempus (servicios.ine.es/wstempus, variable 19) en 2026-10-08:
// 8.192 municipios con código de 5 dígitos (provincia + municipio).
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
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

const CRITERIA: { name: string; allowsNotApplicable: boolean }[] = [
  { name: "Acceso sin escalones", allowsNotApplicable: false },
  { name: "Puerta accesible", allowsNotApplicable: false },
  { name: "Anchura de paso", allowsNotApplicable: false },
  { name: "Espacio de giro", allowsNotApplicable: false },
  { name: "Aseo adaptado", allowsNotApplicable: false },
  { name: "Ascensor accesible", allowsNotApplicable: true },
  { name: "Aparcamiento para personas con movilidad reducida", allowsNotApplicable: true },
  { name: "Señalización accesible", allowsNotApplicable: false },
] as const;

// Denominaciones oficiales INE (Registro de Entidades Locales).
const PROVINCES: { code: string; name: string }[] = [
  { code: "01", name: "Araba/Álava" },
  { code: "02", name: "Albacete" },
  { code: "03", name: "Alicante/Alacant" },
  { code: "04", name: "Almería" },
  { code: "05", name: "Ávila" },
  { code: "06", name: "Badajoz" },
  { code: "07", name: "Balears, Illes" },
  { code: "08", name: "Barcelona" },
  { code: "09", name: "Burgos" },
  { code: "10", name: "Cáceres" },
  { code: "11", name: "Cádiz" },
  { code: "12", name: "Castellón/Castelló" },
  { code: "13", name: "Ciudad Real" },
  { code: "14", name: "Córdoba" },
  { code: "15", name: "Coruña, A" },
  { code: "16", name: "Cuenca" },
  { code: "17", name: "Girona" },
  { code: "18", name: "Granada" },
  { code: "19", name: "Guadalajara" },
  { code: "20", name: "Gipuzkoa" },
  { code: "21", name: "Huelva" },
  { code: "22", name: "Huesca" },
  { code: "23", name: "Jaén" },
  { code: "24", name: "León" },
  { code: "25", name: "Lleida" },
  { code: "26", name: "Rioja, La" },
  { code: "27", name: "Lugo" },
  { code: "28", name: "Madrid" },
  { code: "29", name: "Málaga" },
  { code: "30", name: "Murcia" },
  { code: "31", name: "Navarra" },
  { code: "32", name: "Ourense" },
  { code: "33", name: "Asturias" },
  { code: "34", name: "Palencia" },
  { code: "35", name: "Palmas, Las" },
  { code: "36", name: "Pontevedra" },
  { code: "37", name: "Salamanca" },
  { code: "38", name: "Santa Cruz de Tenerife" },
  { code: "39", name: "Cantabria" },
  { code: "40", name: "Segovia" },
  { code: "41", name: "Sevilla" },
  { code: "42", name: "Soria" },
  { code: "43", name: "Tarragona" },
  { code: "44", name: "Teruel" },
  { code: "45", name: "Toledo" },
  { code: "46", name: "Valencia/València" },
  { code: "47", name: "Valladolid" },
  { code: "48", name: "Bizkaia" },
  { code: "49", name: "Zamora" },
  { code: "50", name: "Zaragoza" },
  { code: "51", name: "Ceuta" },
  { code: "52", name: "Melilla" },
];

interface MunicipalityRow {
  code: string;
  name: string;
  provinceCode: string;
}

async function main(): Promise<void> {
  for (const name of CATEGORIES) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Renombre idempotente de la denominación antigua (SPEC-045).
  // Tras la primera ejecución no encuentra filas y no hace nada.
  await prisma.criterion.updateMany({
    where: { name: "Aparcamiento PMR" },
    data: { name: "Aparcamiento para personas con movilidad reducida" },
  });

  for (const [index, criterion] of CRITERIA.entries()) {
    await prisma.criterion.upsert({
      where: { name: criterion.name },
      update: { order: index + 1, allowsNotApplicable: criterion.allowsNotApplicable },
      create: {
        name: criterion.name,
        order: index + 1,
        allowsNotApplicable: criterion.allowsNotApplicable,
      },
    });
  }

  for (const province of PROVINCES) {
    await prisma.province.upsert({
      where: { code: province.code },
      update: { name: province.name },
      create: { code: province.code, name: province.name },
    });
  }

  const dataDir = join(dirname(fileURLToPath(import.meta.url)), "data");
  const rows = JSON.parse(
    readFileSync(join(dataDir, "municipalities.json"), "utf8"),
  ) as MunicipalityRow[];
  const provinces = await prisma.province.findMany({ select: { id: true, code: true } });
  const provinceIdByCode = new Map(provinces.map((province) => [province.code, province.id]));

  const BATCH_SIZE = 1000;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const data = batch.flatMap((row) => {
      const provinceId = provinceIdByCode.get(row.provinceCode);
      if (!provinceId) {
        return [];
      }
      return [{ code: row.code, name: row.name, provinceId }];
    });
    await prisma.municipality.createMany({ data, skipDuplicates: true });
  }
  console.log(`Provincias: ${PROVINCES.length}, municipios procesados: ${rows.length}`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
