import { prisma } from "@/lib/db/prisma";

export interface ProvinceOption {
  id: string;
  code: string;
  name: string;
}

export interface MunicipalityOption {
  id: string;
  code: string;
  name: string;
  provinceId: string;
}

// Provincias para el desplegable (SPEC-035). Orden alfabético estable.
export async function listProvinces(): Promise<ProvinceOption[]> {
  return prisma.province.findMany({
    orderBy: { name: "asc" },
    select: { id: true, code: true, name: true },
  });
}

// Municipios para el filtrado en cliente (SPEC-035).
// Se cargan una vez en el servidor; el formulario filtra por provincia.
export async function listMunicipalities(): Promise<MunicipalityOption[]> {
  return prisma.municipality.findMany({
    orderBy: { name: "asc" },
    select: { id: true, code: true, name: true, provinceId: true },
  });
}
