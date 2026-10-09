import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { roleLabel } from "@/lib/utils";
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
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <p className="font-semibold">Accesibilidad 360</p>
        <details className="relative">
          <summary aria-label="Menú de usuario">
            {user.name ?? user.email} <Badge variant="secondary">{roleLabel(user.role)}</Badge>
          </summary>
          <div className="absolute right-0 top-full z-10 mt-1 space-y-2 rounded-md border bg-background p-3 shadow-md">
            <p>{user.name}</p>
            <p className="text-muted-foreground">{roleLabel(user.role)}</p>
            {user.role === "ADMIN" && <Link href="/admin">Administración</Link>}
            <form action={logoutAction}>
              <Button type="submit" size="sm">
                Cerrar sesión
              </Button>
            </form>
          </div>
        </details>
      </div>
    </header>
  );
}
