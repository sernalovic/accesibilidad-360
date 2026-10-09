import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perfil | Accesibilidad 360",
  description: "Gestiona tu perfil de Accesibilidad 360.",
};

// Placeholder temporal (SPEC-010): evita el 404 hasta la fase
// de usuarios. Sin lógica ni datos.
export default function ProfilePage() {
  return (
    <main id="contenido">
      <h1 className="text-3xl font-bold">Perfil</h1>
      <p>Disponible en la siguiente fase.</p>
    </main>
  );
}
