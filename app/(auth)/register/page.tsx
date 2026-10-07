import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "Crear cuenta | Accesibilidad 360",
  description: "Crea tu cuenta para colaborar en Accesibilidad 360.",
};

// Página de registro (SPEC-010 fase 010.3).
// Solo compone; la lógica vive en el módulo features/auth.
export default function RegisterPage() {
  return (
    <main>
      <h1>Crear cuenta</h1>
      <RegisterForm />
    </main>
  );
}
