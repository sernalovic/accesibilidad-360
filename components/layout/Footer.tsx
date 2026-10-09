import Link from "next/link";
import { Container } from "@/components/layout/Container";

// Pie global de la aplicación (SPEC-135).
// Visible en todas las páginas (públicas y autenticadas) al montarse
// en el layout raíz. Solo presentación: sin lógica ni servicios.
// La información legal queda separada de la del proyecto.
export function Footer() {
  return (
    <footer className="border-t">
      <Container>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Accesibilidad 360</p>
          <nav aria-label="Información legal">
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              <li>
                <Link href="/legal" className="hover:underline">
                  Aviso legal
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:underline">
                  Política de cookies
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Proyecto desarrollado como Trabajo Fin de Máster de Desarrollo con IA - Big School.
        </p>
      </Container>
    </footer>
  );
}
