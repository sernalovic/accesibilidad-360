// Punto de entrada público del módulo de autenticación (SPEC-010).
// Reexporta únicamente lo necesario para el resto de la aplicación.

export { auth, signIn, signOut, unstable_update } from "./auth";
export { authConfig } from "./auth.config";
