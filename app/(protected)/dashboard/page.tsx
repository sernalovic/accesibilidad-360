import type { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Panel principal | Accesibilidad 360",
  description: "Resumen de tu actividad en Accesibilidad 360.",
};

// Panel temporal (SPEC-010). Hereda la protección del layout;
// no reimplementa ninguna comprobación de sesión.
export default async function DashboardPage() {
  const session = await auth();
  const name = session?.user?.name ?? session?.user?.email ?? "—";

  return (
    <main>
      <Container>
        <h1>Panel principal</h1>
        <p>Bienvenido, {name}.</p>
        <dl>
          <div>
            <dt>Nombre</dt>
            <dd>{session?.user?.name ?? "—"}</dd>
          </div>
          <div>
            <dt>Correo electrónico</dt>
            <dd>{session?.user?.email ?? "—"}</dd>
          </div>
          <div>
            <dt>Rol</dt>
            <dd>{session?.user?.role ?? "—"}</dd>
          </div>
        </dl>
      </Container>
    </main>
  );
}
