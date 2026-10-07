import { handlers } from "@/lib/auth/auth";

// Route Handler obligatorio de Auth.js (SPEC-010 fase 010.1).
// Gestiona el flujo del protocolo de autenticación; no es una API
// interna de negocio y no debe utilizarse para lógica del producto.
export const { GET, POST } = handlers;
