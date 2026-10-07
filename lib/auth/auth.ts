import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Role } from "@prisma/client";
import { authConfig } from "./auth.config";
import { loginSchema } from "@/features/auth/schemas/login.schema";
import { verifyCredentials } from "@/features/auth/services/login.service";

// Punto de entrada de Auth.js v5 (SPEC-010, entorno Node).
// - `handlers`: consumidos por `app/api/auth/[...nextauth]/route.ts`.
// - `auth`: lectura de sesión en Server Components.
// - `signIn` / `signOut`: fases de login/logout.
//
// Decisión de integración temporal (ver `.ai/decisions.md`):
// Auth.js v5 exige `authorize` en este init, pero la verificación de
// credenciales es lógica de dominio y vive en features/auth/services.
// Este archivo solo cablea; no contiene reglas de negocio.
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Correo electrónico", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }
        return verifyCredentials(parsed.data.email, parsed.data.password);
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      // `role` viaja en el token con tipado local: la aumentación de
      // "next-auth/jwt" no se propaga al tipo usado en los callbacks.
      if (user?.role) {
        (token as typeof token & { role?: Role }).role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub ?? "";
      const role = (token as { role?: Role }).role;
      if (role) {
        session.user.role = role;
      }
      return session;
    },
  },
});
