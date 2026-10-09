import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Aviso legal | Accesibilidad 360",
  description: "Aviso legal de Accesibilidad 360.",
};

// Aviso legal (SPEC-135). Contenido estático, sin lógica.
export default function LegalPage() {
  return (
    <main id="contenido">
      <Container>
        <div className="max-w-2xl space-y-6">
          <h1 className="text-3xl font-bold">Aviso legal</h1>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Titularidad y objeto</h2>
            <p>
              Accesibilidad 360 es una aplicación desarrollada como Trabajo Fin de Máster. Su
              finalidad es facilitar información colaborativa sobre la accesibilidad de
              establecimientos públicos y privados, aportada por las propias personas usuarias.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Responsabilidad de los contenidos</h2>
            <p>
              Las personas usuarias son responsables del contenido que publican, incluidas sus
              valoraciones, comentarios y fotografías. La información mostrada refleja experiencias
              individuales de la comunidad y no constituye una certificación oficial de
              accesibilidad de ningún establecimiento.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Moderación</h2>
            <p>
              Los contenidos que incumplan las normas de uso podrán ser moderados o eliminados, en
              particular aquellos que resulten ofensivos, falsos o ajenos a la finalidad de la
              plataforma.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Fines académicos</h2>
            <p>
              El software se distribuye únicamente con fines académicos, como parte del Trabajo Fin
              de Máster para el que fue desarrollado.
            </p>
          </section>
        </div>
      </Container>
    </main>
  );
}
