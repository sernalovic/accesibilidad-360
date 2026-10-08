import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { EstablishmentCard } from "@/features/establishments/components/EstablishmentCard";
import { EstablishmentFilters } from "@/features/establishments/components/EstablishmentFilters";
import { listCategories } from "@/features/establishments/services/category.service";
import { searchEstablishments } from "@/features/establishments/services/establishment.service";
import { listMunicipalities, listProvinces } from "@/features/establishments/services/geo.service";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Establecimientos | Accesibilidad 360",
  description: "Explora los establecimientos de Accesibilidad 360.",
};

const SORT_OPTIONS = [
  { value: "recent", label: "Más recientes" },
  { value: "oldest", label: "Más antiguos" },
  { value: "name-asc", label: "Nombre A–Z" },
  { value: "name-desc", label: "Nombre Z–A" },
  { value: "rating", label: "Mejor valorados" },
];

interface EstablishmentsPageProps {
  searchParams: Promise<{
    search?: string | string[];
    category?: string | string[];
    province?: string | string[];
    municipality?: string | string[];
    sort?: string | string[];
  }>;
}

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

// Listado con búsqueda y filtros (SPEC-070).
// Todo viaja en la URL; el formulario GET la reescribe y los valores
// vuelven como valores iniciales (filtros persistidos).
export default async function EstablishmentsPage({ searchParams }: EstablishmentsPageProps) {
  const params = await searchParams;
  const filters = {
    search: first(params.search),
    categoryId: first(params.category),
    provinceId: first(params.province),
    municipalityId: first(params.municipality),
    sort: first(params.sort),
  };
  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  const [establishments, categories, provinces, municipalities] = await Promise.all([
    searchEstablishments(filters),
    listCategories(),
    listProvinces(),
    listMunicipalities(),
  ]);

  return (
    <main>
      <Container>
        <h1>Establecimientos</h1>
        <Link href="/establishments/new" className={buttonVariants()}>
          Nueva ficha
        </Link>
        <EstablishmentFilters
          categories={categories}
          provinces={provinces}
          municipalities={municipalities}
          values={filters}
          sortOptions={SORT_OPTIONS}
        />
        {establishments.length === 0 ? (
          <div>
            {hasActiveFilters ? (
              <p>No se han encontrado establecimientos con esos filtros.</p>
            ) : (
              <p>
                Aún no se ha añadido ningún establecimiento. ¡Crea la primera ficha y ayuda a la
                comunidad!
              </p>
            )}
            <Link
              href={hasActiveFilters ? "/establishments" : "/establishments/new"}
              className={buttonVariants()}
            >
              {hasActiveFilters ? "Limpiar filtros" : "Nueva ficha"}
            </Link>
          </div>
        ) : (
          <ul>
            {establishments.map((establishment) => (
              <li key={establishment.id}>
                <EstablishmentCard establishment={establishment} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </main>
  );
}
