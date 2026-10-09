import type { Metadata } from "next";
import Link from "next/link";
import { Camera, MapPin, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { BenefitCard } from "@/components/landing/BenefitCard";
import { FinalCta } from "@/components/landing/FinalCta";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { InfoCriteria } from "@/components/landing/InfoCriteria";

export const metadata: Metadata = {
  title: "Accesibilidad 360",
  description:
    "Conoce la accesibilidad real de los establecimientos antes de desplazarte, con información compartida por la comunidad.",
};

const benefits = [
  {
    icon: Search,
    title: "Consulta información real de la comunidad",
    description:
      "Fichas con valoraciones, puntuaciones y datos útiles aportados por personas que ya han visitado el establecimiento.",
  },
  {
    icon: Camera,
    title: "Comparte tu experiencia",
    description:
      "Valora la accesibilidad, sube fotografías y deja comentarios para que otras personas sepan qué se van a encontrar.",
  },
  {
    icon: MapPin,
    title: "Explora el mapa colaborativo",
    description:
      "Localiza establecimientos en el mapa y consulta su accesibilidad antes de decidir tu desplazamiento.",
  },
] as const;

// Landing pública. Solo presentación: sin servicios, sin consultas,
// sin cambios de autenticación ni permisos.
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
          <div className="space-y-12">
            <div>
              <h1 className="text-4xl font-bold">Accesibilidad 360</h1>
              <p className="mt-4 max-w-2xl text-lg">
                Antes de desplazarte, conviene saber si un establecimiento es realmente accesible:
                si podrás entrar, moverte y usar sus instalaciones. Accesibilidad 360 recoge esa
                información de forma colaborativa, con valoraciones, fotografías y experiencias
                compartidas por la comunidad.
              </p>
              <div className="mt-6 flex gap-2">
                <Link href="/login" className={buttonVariants()}>
                  Iniciar sesión
                </Link>
                <Link href="/register" className={buttonVariants({ variant: "outline" })}>
                  Crear cuenta
                </Link>
              </div>
            </div>

            <section aria-label="Beneficios" className="grid gap-4 md:grid-cols-3">
              {benefits.map((benefit) => (
                <BenefitCard
                  key={benefit.title}
                  icon={benefit.icon}
                  title={benefit.title}
                  description={benefit.description}
                />
              ))}
            </section>

            <HowItWorks />

            <InfoCriteria />

            <FinalCta />
          </div>
        </Container>
      </main>
    </div>
  );
}
