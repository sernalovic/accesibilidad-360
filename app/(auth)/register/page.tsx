import type { Metadata } from "next";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "Crear cuenta | Accesibilidad 360",
  description: "Crea tu cuenta para colaborar en Accesibilidad 360.",
};

// Página de registro (Sprint UI-001: Card centrada).
// Solo compone; la lógica vive en el módulo features/auth.
export default function RegisterPage() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-12">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold">Crear cuenta</h1>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </main>
  );
}
