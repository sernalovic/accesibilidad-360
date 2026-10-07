import { logoutAction } from "@/features/auth/actions/logout.action";

interface TopbarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role: string;
  };
}

// Barra superior del shell autenticado (SPEC-010).
// Server Component sin JavaScript: el menú usa <details> y el cierre
// de sesión un <form> con Server Action.
export function Topbar({ user }: TopbarProps) {
  return (
    <header>
      <p>Accesibilidad 360</p>
      <details>
        <summary aria-label="Menú de usuario">
          {user.name ?? user.email} — {user.role}
        </summary>
        <div>
          <p>{user.name}</p>
          <p>{user.role}</p>
          <form action={logoutAction}>
            <button type="submit">Cerrar sesión</button>
          </form>
        </div>
      </details>
    </header>
  );
}
