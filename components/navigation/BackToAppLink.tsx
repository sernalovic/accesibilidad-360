"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackToAppLinkProps {
  fallbackHref: string;
}

// Enlace de retorno a la aplicación (páginas legales).
// Client Component justificado: retroceso por historial.
// Si existe historial navegable, vuelve atrás; si no (acceso directo,
// pestaña nueva o primera página), navega al fallback. Sin JavaScript
// funciona como un enlace normal al fallbackHref.
export function BackToAppLink({ fallbackHref }: BackToAppLinkProps) {
  const router = useRouter();

  const goBack = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      event.preventDefault();
      router.back();
    }
  };

  return (
    <Link
      href={fallbackHref}
      onClick={goBack}
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground hover:underline"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      Volver a la aplicación
    </Link>
  );
}
