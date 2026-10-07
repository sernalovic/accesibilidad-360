import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import { auth } from "./auth";

// Exige una sesión activa o redirige a /login (SPEC-010).
// Completamente agnóstico a la página que lo invoca: reutilizable
// en el layout protegido y en cualquier futuro módulo protegido.
export async function requireSession(): Promise<Session> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}
