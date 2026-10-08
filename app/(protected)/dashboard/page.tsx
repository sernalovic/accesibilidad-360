import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth/auth";
import { Container } from "@/components/layout/Container";
import { DashboardEstablishmentCard } from "@/features/dashboard/components/DashboardEstablishmentCard";
import { DashboardReviewCard } from "@/features/dashboard/components/DashboardReviewCard";
import { DashboardSection } from "@/features/dashboard/components/DashboardSection";
import { DashboardStatCard } from "@/features/dashboard/components/DashboardStatCard";
import { getDashboardData } from "@/features/dashboard/services/dashboard.service";

export const metadata: Metadata = {
  title: "Panel principal | Accesibilidad 360",
  description: "Resumen de la actividad en Accesibilidad 360.",
};

const quickActions = [
  { href: "/establishments/new", label: "Nuevo establecimiento" },
  { href: "/establishments", label: "Buscar establecimientos" },
  { href: "/map", label: "Mapa" },
  { href: "/profile", label: "Mi perfil" },
];

// Panel principal funcional (SPEC-100).
// Solo compone el DTO preparado por el servicio; sin cálculos aquí.
export default async function DashboardPage() {
  const session = await auth();
  const name = session?.user?.name ?? session?.user?.email ?? "—";
  const data = await getDashboardData();

  return (
    <main>
      <Container>
        <h1>Panel principal</h1>
        <p>Bienvenido, {name}.</p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardStatCard label="Establecimientos" value={data.stats.establishments} />
          <DashboardStatCard label="Usuarios" value={data.stats.users} />
          <DashboardStatCard label="Valoraciones" value={data.stats.reviews} />
          <DashboardStatCard label="Fotografías" value={data.stats.photos} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <DashboardSection title="Últimos establecimientos">
            {data.latest.length === 0 ? (
              <p>Aún no hay establecimientos.</p>
            ) : (
              <ul className="grid gap-4">
                {data.latest.map((establishment) => (
                  <li key={establishment.id}>
                    <DashboardEstablishmentCard establishment={establishment} />
                  </li>
                ))}
              </ul>
            )}
          </DashboardSection>

          <DashboardSection title="Mejor valorados">
            {data.topRated.length === 0 ? (
              <p>Aún no hay valoraciones.</p>
            ) : (
              <ul className="grid gap-4">
                {data.topRated.map((establishment) => (
                  <li key={establishment.id}>
                    <DashboardEstablishmentCard establishment={establishment} />
                  </li>
                ))}
              </ul>
            )}
          </DashboardSection>
        </div>

        <DashboardSection title="Últimas valoraciones">
          {data.latestReviews.length === 0 ? (
            <p>Aún no hay valoraciones.</p>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2">
              {data.latestReviews.map((review) => (
                <li key={review.id}>
                  <DashboardReviewCard review={review} />
                </li>
              ))}
            </ul>
          )}
        </DashboardSection>

        <DashboardSection title="Accesos rápidos">
          <nav aria-label="Accesos rápidos">
            <ul className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <li key={action.href}>
                  <Link href={action.href} className={buttonVariants({ variant: "outline" })}>
                    {action.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </DashboardSection>
      </Container>
    </main>
  );
}
