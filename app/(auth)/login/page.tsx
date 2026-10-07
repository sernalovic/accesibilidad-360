import type { Metadata } from "next";
import { SuccessNotice } from "@/features/auth/components/SuccessNotice";

export const metadata: Metadata = {
  title: "Iniciar sesión | Accesibilidad 360",
  description: "Accede a tu cuenta de Accesibilidad 360.",
};

interface LoginPageProps {
  searchParams: Promise<{ registered?: string }>;
}

// Página provisional de inicio de sesión (SPEC-010, microfase previa al login).
// Estática: sin formularios, sin Auth.js y sin llamadas al servidor.
// El formulario real llegará en la fase de login.
export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { registered } = await searchParams;
  const justRegistered = registered === "true";

  return (
    <main>
      <h1>Iniciar sesión</h1>
      {justRegistered ? (
        <SuccessNotice message="Tu cuenta se ha creado correctamente. Ya puedes iniciar sesión." />
      ) : (
        <p>La autenticación estará disponible en la siguiente fase.</p>
      )}
    </main>
  );
}
