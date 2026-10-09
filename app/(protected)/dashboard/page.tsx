import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Camera, Star, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth/auth";
import { Container } from "@/components/layout/Container";
import { DashboardEstablishmentCard } from "@/features/dashboard/components/DashboardEstablishmentCard";
import { DashboardSection } from "@/features/dashboard/components/DashboardSection";
import { DashboardStatCard } from "@/features/dashboard/components/DashboardStatCard";
import { formatDecimalScore } from "@/features/establishments/utils/score-format";
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

const MEDALS = ["🥇", "🥈", "🥉"] as const;

// Panel principal (SPEC-100 + microfase UX).
// Solo compone el DTO preparado por el servicio; sin cálculos aquí.
// Microfase UX: sin bloque de últimas valoraciones (el servicio mantiene
// latestReviews para futuras evoluciones), protagonistas los 6 últimos.
export default async function DashboardPage() {
  const session = await auth();
  const name = session?.user?.name ?? session?.user?.email ?? "—";
  const data = await getDashboardData();

  return (
    <main id="contenido">
      <Container>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Panel principal</h1>
            <p>Bienvenido, {name}.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardStatCard
              label="Establecimientos"
              value={data.stats.establishments}
              icon={Building2}
            />
            <DashboardStatCard label="Usuarios" value={data.stats.users} icon={Users} />
            <DashboardStatCard label="Valoraciones" value={data.stats.reviews} icon={Star} />
            <DashboardStatCard label="Fotografías" value={data.stats.photos} icon={Camera} />
          </div>

          <DashboardSection title="Últimos establecimientos">
            {data.latest.length === 0 ? (
              <p>Aún no hay establecimientos.</p>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.latest.map((establishment) => (
                  <li key={establishment.id} className="h-full">
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
              <ol className="space-y-1">
                {data.topRated.map((establishment, index) => (
                  <li
                    key={establishment.id}
                    className={
                      index === 0
                        ? "flex items-center gap-3 rounded-md bg-muted px-3 py-2 font-medium"
                        : "flex items-center gap-3 px-3 py-2"
                    }
                  >
                    {index < MEDALS.length ? (
                      <span aria-hidden="true">{MEDALS[index]}</span>
                    ) : (
                      <span aria-hidden="true">{index + 1}.</span>
                    )}
                    <span className="sr-only">Puesto {index + 1}: </span>
                    <Link
                      href={`/establishments/${establishment.id}`}
                      className="min-w-0 flex-1 truncate"
                      title={establishment.name}
                    >
                      {establishment.name}
                    </Link>
                    <span className="text-muted-foreground">{establishment.category}</span>
                    <span>
                      {formatDecimalScore(establishment.averageScore)} / 5 ·{" "}
                      {establishment.reviewCount === 1
                        ? "1 valoración"
                        : `${establishment.reviewCount} valoraciones`}
                    </span>
                  </li>
                ))}
              </ol>
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
        </div>
      </Container>
    </main>
  );
}
