import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Política de cookies | Accesibilidad 360",
  description: "Política de cookies de Accesibilidad 360.",
};

// Política de cookies (SPEC-135). Contenido estático, sin lógica.
export default function CookiesPage() {
  return (
    <main id="contenido">
      <Container>
        <div className="max-w-2xl space-y-6">
          <h1 className="text-3xl font-bold">Política de cookies</h1>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Cookies que utilizamos</h2>
            <p>
              Accesibilidad 360 utiliza únicamente las cookies técnicas imprescindibles para el
              funcionamiento de la autenticación y la sesión, gestionadas por Auth.js. Sin ellas no
              es posible mantener la sesión iniciada.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Lo que no utilizamos</h2>
            <ul className="list-disc space-y-1 pl-6">
              <li>No existen cookies publicitarias.</li>
              <li>No existen cookies de seguimiento.</li>
              <li>No existe publicidad.</li>
              <li>No se utilizan herramientas analíticas.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Gestión en el navegador</h2>
            <p>
              Puedes bloquear las cookies desde la configuración de tu navegador, pero en ese caso
              no podrás iniciar sesión ni usar las funciones que requieren autenticación.
            </p>
          </section>
        </div>
      </Container>
    </main>
  );
}
