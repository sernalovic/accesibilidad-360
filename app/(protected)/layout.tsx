import { requireSession } from "@/lib/auth/require-session";
import { Topbar } from "@/components/layout/Topbar";
import { MainNav } from "@/components/layout/MainNav";

// Layout del grupo protegido (SPEC-010).
// Punto único de protección: sin sesión redirige a /login.
// Las páginas heredan la protección; no deben reimplementarla.
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();

  return (
    <>
      <Topbar
        user={{ name: session.user.name, email: session.user.email, role: session.user.role }}
      />
      <MainNav />
      {children}
    </>
  );
}
