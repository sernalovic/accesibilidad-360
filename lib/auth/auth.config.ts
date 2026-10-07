import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Fase 010.1 (SPEC-010): andamiaje de autenticación.
// Este archivo debe seguir siendo compatible con el Edge Runtime
// porque también lo utiliza `middleware.ts`. No importar aquí
// adaptadores de base de datos ni utilidades específicas de Node.
//
// Decisiones temporales documentadas:
// - Único provider: Credentials (sin OAuth, según restricciones de SPEC-010).
// - Sesiones JWT: no existe todavía el modelo User, por lo que no puede
//   utilizarse PrismaAdapter. Las sesiones de base de datos llegarán
//   con los modelos, sin cambiar esta arquitectura.

/**
 * Temporalmente se utiliza estrategia JWT.
 *
 * En la fase 010.2 se migrará a Prisma Adapter y sesiones persistentes.
 */

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Correo electrónico", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize() {
        // TODO(SPEC-010, fase login): verificar las credenciales contra
        // Prisma cuando exista el modelo User. Hasta entonces deniega.
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  // TODO(SPEC-010, fase páginas): configurar `pages` (signIn, error, ...)
  // cuando existan las rutas de autenticación.
};
