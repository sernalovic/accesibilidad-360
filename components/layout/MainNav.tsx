import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Panel principal" },
  { href: "/establishments", label: "Establecimientos" },
  { href: "/map", label: "Mapa" },
  { href: "/profile", label: "Perfil" },
];

// Navegación principal del shell autenticado (SPEC-010).
// Las páginas pendientes muestran un placeholder, nunca un 404.
export function MainNav() {
  return (
    <nav aria-label="Navegación principal" className="border-b">
      <ul className="mx-auto flex w-full max-w-6xl flex-wrap gap-x-6 gap-y-2 px-4 py-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
