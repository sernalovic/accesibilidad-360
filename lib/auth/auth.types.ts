import type { DefaultSession } from "next-auth";
import type { Role } from "@prisma/client";

// Ampliación de sesión (SPEC-010 fase 010.4).
// Expone `id` y `role`, necesarios para el dashboard temporal
// y la futura autorización por rol.
declare module "next-auth" {
  interface User {
    role: Role;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }
}

export {};
