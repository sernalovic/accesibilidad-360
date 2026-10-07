import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";

// Fase 010.4 (SPEC-010): el middleware ejecuta en Edge, por lo que usa
// únicamente `authConfig` (edge-safe). `lib/auth/auth.ts` importa Prisma
// y bcrypt (Node) y no puede cargarse aquí.
// Comportamiento: solo refresco de sesión, sin proteger rutas todavía.
// TODO(SPEC-010, fase autorización): redirigir a /login en rutas
// protegidas y aplicar control por rol.
const { auth } = NextAuth(authConfig);

export default auth(function middleware() {
  // Intencionalmente vacío en esta fase.
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
