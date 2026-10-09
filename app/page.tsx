import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Accesibilidad 360",
  description: "Consulta y comparte información sobre la accesibilidad de establecimientos.",
};

const highlights = [
  {
    title: "Valoraciones colaborativas",
    description: "La comunidad valora la accesibilidad real de cada establecimiento.",
  },
  {
    title: "Información de accesibilidad",
    description: "Consulta fichas con datos útiles antes de desplazarte.",
  },
  {
    title: "Mapa colaborativo",
    description: "Próximamente: localiza establecimientos accesibles en el mapa.",
  },
];

// Landing pública (Sprint UI-001). Solo presentación.
export default function HomePage() {
  return (
    <div>
      <header className="border-b">
        <Container>
          <nav aria-label="Navegación principal" className="flex items-center justify-between">
            <p className="font-semibold">Accesibilidad 360</p>
            <div className="flex gap-2">
              <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
                Iniciar sesión
              </Link>
              <Link href="/register" className={buttonVariants()}>
                Crear cuenta
              </Link>
            </div>
          </nav>
        </Container>
      </header>

      <main id="contenido">
        <Container>
          <h1 className="text-4xl font-bold">Accesibilidad 360</h1>
          <p className="mt-4 max-w-2xl text-lg">
            Consulta y comparte información sobre la accesibilidad de establecimientos.
          </p>
          <div className="mt-6 flex gap-2">
            <Link href="/login" className={buttonVariants()}>
              Iniciar sesión
            </Link>
            <Link href="/register" className={buttonVariants({ variant: "outline" })}>
              Crear cuenta
            </Link>
          </div>

          <section aria-label="Características" className="mt-12 grid gap-4 md:grid-cols-3">
            {highlights.map((highlight) => (
              <Card key={highlight.title}>
                <CardHeader>
                  <CardTitle>{highlight.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{highlight.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </section>
        </Container>
      </main>

      <footer className="border-t">
        <Container>
          <p>TFM Desarrollo con IA · Big School· Next.js · Prisma · PostgreSQL</p>
        </Container>
      </footer>
    </div>
  );
}
