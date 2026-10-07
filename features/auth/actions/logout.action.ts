"use server";

import { signOut } from "@/lib/auth/auth";

// Cierra la sesión mediante Auth.js y redirige a /login (SPEC-010).
// Sin JavaScript en cliente: se invoca desde un <form>.
export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}
