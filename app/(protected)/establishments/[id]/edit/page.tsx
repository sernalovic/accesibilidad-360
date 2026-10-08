import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { Container } from "@/components/layout/Container";
import { EstablishmentForm } from "@/features/establishments/components/EstablishmentForm";
import { listCategories } from "@/features/establishments/services/category.service";
import { getEstablishmentById } from "@/features/establishments/services/establishment.service";
import { listMunicipalities, listProvinces } from "@/features/establishments/services/geo.service";
import { canManageEstablishment } from "@/features/establishments/services/establishment-permissions";

export const metadata: Metadata = {
  title: "Editar establecimiento | Accesibilidad 360",
  description: "Edita la ficha del establecimiento.",
};

interface EditEstablishmentPageProps {
  params: Promise<{ id: string }>;
}

// Edición (SPEC-080). Solo creador o ADMIN; el resto ve notFound
// (sin filtrar existencia). Reutiliza el formulario en modo edición.
export default async function EditEstablishmentPage({ params }: EditEstablishmentPageProps) {
  const { id } = await params;
  const session = await auth();
  const [establishment, categories, provinces, municipalities] = await Promise.all([
    getEstablishmentById(id),
    listCategories(),
    listProvinces(),
    listMunicipalities(),
  ]);
  if (!establishment) {
    notFound();
  }
  const user = session?.user;
  if (
    !user ||
    !canManageEstablishment({ id: user.id, role: user.role }, establishment.createdById)
  ) {
    notFound();
  }

  return (
    <main>
      <Container>
        <h1>Editar establecimiento</h1>
        <EstablishmentForm
          mode="edit"
          establishmentId={establishment.id}
          initialValues={{
            name: establishment.name,
            categoryId: establishment.categoryId,
            address: establishment.address,
            provinceId: establishment.provinceId,
            municipalityId: establishment.municipalityId,
            description: establishment.description ?? "",
          }}
          categories={categories}
          provinces={provinces}
          municipalities={municipalities}
        />
      </Container>
    </main>
  );
}
