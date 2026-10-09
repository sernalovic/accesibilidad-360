import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { isAdmin } from "@/lib/permissions";
import { Container } from "@/components/layout/Container";
import { CategoryManager } from "@/features/establishments/components/CategoryManager";
import { listCategoriesWithUsage } from "@/features/establishments/services/category.service";

export const metadata: Metadata = {
  title: "Administración | Accesibilidad 360",
  description: "Gestión del contenido de Accesibilidad 360.",
};

// Panel mínimo de administración (SPEC-110).
// Guard en servidor + enlace oculto a no-admins. Sin CMS.
export default async function AdminPage() {
  const session = await auth();
  const user = session?.user;
  if (!user || !isAdmin(user)) {
    notFound();
  }

  const categories = await listCategoriesWithUsage();

  return (
    <main id="contenido">
      <Container>
        <h1 className="text-3xl font-bold">Administración</h1>
        <section aria-labelledby="categories-heading">
          <h2 id="categories-heading">Categorías</h2>
          <CategoryManager initialCategories={categories} />
        </section>
      </Container>
    </main>
  );
}
