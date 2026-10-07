// Punto de entrada público del módulo de autenticación (SPEC-010).
// Reexporta únicamente lo necesario para el resto de la aplicación.

export { auth, signIn, signOut } from "./auth";
export { authConfig } from "./auth.config";
