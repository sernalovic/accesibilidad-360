import type { NextAuthConfig } from "next-auth";

// Fase 010.4 (SPEC-010): configuración compatible con el Edge Runtime.
// La utiliza `middleware.ts` y se extiende en `lib/auth/auth.ts` con el
// provider Credentials (Node). No importar aquí Prisma, bcrypt ni
// adaptadores: romperían el bundle Edge.
export const authConfig: NextAuthConfig = {
  // Sin providers aquí: el provider Credentials (Node) se añade en
  // `lib/auth/auth.ts`. El middleware solo necesita la sesión.
  providers: [],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    authorized() {
      // TODO(SPEC-010, fase autorización): proteger rutas por
      // autenticación y rol. De momento solo refresca la sesión.
      return true;
    },
  },
};
