import type { Metadata } from "next";
import { SuccessNotice } from "@/features/auth/components/SuccessNotice";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión | Accesibilidad 360",
  description: "Accede a tu cuenta de Accesibilidad 360.",
};

interface LoginPageProps {
  searchParams: Promise<{ registered?: string }>;
}

// Inicio de sesión (SPEC-010 fase 010.4).
// Solo compone: el aviso de registro, el formulario y la lógica
// viven en el módulo features/auth.
export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { registered } = await searchParams;
  const justRegistered = registered === "true";

  return (
    <main>
      <h1>Iniciar sesión</h1>
      {justRegistered && (
        <SuccessNotice message="Tu cuenta se ha creado correctamente. Ya puedes iniciar sesión." />
      )}
      <LoginForm />
    </main>
  );
}
