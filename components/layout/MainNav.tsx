import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/establishments", label: "Establecimientos" },
  { href: "/profile", label: "Perfil" },
];

// Navegación principal del shell autenticado (SPEC-010).
// Las páginas pendientes muestran un placeholder, nunca un 404.
export function MainNav() {
  return (
    <nav aria-label="Navegación principal">
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
