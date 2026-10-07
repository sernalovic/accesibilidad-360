// Contenedor reutilizable (Sprint UI-001).
// Ancho máximo, centrado y padding consistente para las páginas.
// Evita duplicar estas clases en cada página.
export function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-4 py-8">{children}</div>;
}
