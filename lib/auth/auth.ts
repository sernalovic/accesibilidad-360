import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Punto de entrada de Auth.js v5 (SPEC-010).
// - `handlers`: consumidos por `app/api/auth/[...nextauth]/route.ts`.
// - `auth`: lectura de sesión en Server Components y middleware.
// - `signIn` / `signOut`: se utilizarán en las fases de login/logout.
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
