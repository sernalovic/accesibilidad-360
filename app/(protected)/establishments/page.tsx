import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Establecimientos | Accesibilidad 360",
  description: "Explora los establecimientos de Accesibilidad 360.",
};

// Placeholder temporal (SPEC-010): evita el 404 hasta la fase
// de establecimientos. Sin lógica ni datos.
export default function EstablishmentsPage() {
  return (
    <main>
      <h1>Establecimientos</h1>
      <p>Disponible en la siguiente fase.</p>
    </main>
  );
}
