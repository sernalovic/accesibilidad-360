import { auth } from "@/lib/auth/auth";

// Fase 010.1 (SPEC-010): el middleware únicamente garantiza el refresco
// de la sesión. Todavía no protege rutas.
// TODO(SPEC-010, fase autorización): redirigir a /login en rutas
// protegidas y aplicar control por rol.
export default auth(function middleware() {
  // Intencionalmente vacío en esta fase.
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
