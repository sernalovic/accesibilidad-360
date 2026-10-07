import type { Metadata } from "next";
import { EstablishmentForm } from "@/features/establishments/components/EstablishmentForm";
import { listCategories } from "@/features/establishments/services/category.service";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Nuevo establecimiento | Accesibilidad 360",
  description: "Registra un nuevo establecimiento en Accesibilidad 360.",
};

// Página de nueva ficha (SPEC-030). Protegida por el layout.
// Solo compone: categorías del servidor y lógica del módulo.
export default async function NewEstablishmentPage() {
  const categories = await listCategories();

  return (
    <main>
      <Container>
        <h1>Nuevo establecimiento</h1>
        <EstablishmentForm categories={categories} />
      </Container>
    </main>
  );
}
