import type { Metadata } from "next";
import { EstablishmentForm } from "@/features/establishments/components/EstablishmentForm";
import { listCategories } from "@/features/establishments/services/category.service";
import { listMunicipalities, listProvinces } from "@/features/establishments/services/geo.service";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Nuevo establecimiento | Accesibilidad 360",
  description: "Registra un nuevo establecimiento en Accesibilidad 360.",
};

// Página de nueva ficha (SPEC-030 + SPEC-035). Protegida por el layout.
// Provincias y municipios servidos una vez; el filtrado es en cliente.
export default async function NewEstablishmentPage() {
  const [categories, provinces, municipalities] = await Promise.all([
    listCategories(),
    listProvinces(),
    listMunicipalities(),
  ]);

  return (
    <main id="contenido">
      <Container>
        <h1 className="text-3xl font-bold">Nuevo establecimiento</h1>
        <EstablishmentForm
          categories={categories}
          provinces={provinces}
          municipalities={municipalities}
        />
      </Container>
    </main>
  );
}
