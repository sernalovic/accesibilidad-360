"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Panel principal" },
  { href: "/establishments", label: "Establecimientos" },
  { href: "/map", label: "Mapa" },
  { href: "/profile", label: "Perfil" },
];

// Navegación principal del shell autenticado (SPEC-010).
// Client Component justificado: estado activo vía usePathname.
// Solo presentación (botones consistentes + aria-current); sin cambios de comportamiento.
// Las páginas pendientes muestran un placeholder, nunca un 404.
export function MainNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegación principal">
      <ul className="flex flex-wrap items-center gap-2 py-2">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
