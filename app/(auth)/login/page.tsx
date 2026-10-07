import type { Metadata } from "next";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SuccessNotice } from "@/features/auth/components/SuccessNotice";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión | Accesibilidad 360",
  description: "Accede a tu cuenta de Accesibilidad 360.",
};

interface LoginPageProps {
  searchParams: Promise<{ registered?: string }>;
}

// Inicio de sesión (Sprint UI-001: Card centrada).
// Solo compone: el aviso de registro, el formulario y la lógica
// viven en el módulo features/auth.
export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { registered } = await searchParams;
  const justRegistered = registered === "true";

  return (
    <main className="mx-auto w-full max-w-md px-4 py-12">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
        </CardHeader>
        <CardContent className="space-y-4">
          {justRegistered && (
            <SuccessNotice message="Tu cuenta se ha creado correctamente. Ya puedes iniciar sesión." />
          )}
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
