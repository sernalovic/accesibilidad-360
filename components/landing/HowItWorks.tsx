const steps = [
  {
    title: "Busca un establecimiento",
    description: "Localiza el lugar al que quieres ir por nombre, categoría o municipio.",
  },
  {
    title: "Consulta valoraciones, fotografías y puntuaciones",
    description: "Revisa la experiencia de otras personas antes de desplazarte.",
  },
  {
    title: "Comparte tu experiencia",
    description: "Valora y sube fotografías para ayudar a otras personas.",
  },
] as const;

// Sección "Cómo funciona" de la landing (solo presentación).
export function HowItWorks() {
  return (
    <section aria-label="Cómo funciona" className="space-y-4">
      <h2 className="text-2xl font-semibold">Cómo funciona</h2>
      <ol className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="space-y-1">
            <p className="font-medium">
              <span aria-hidden="true">{index + 1}. </span>
              <span className="sr-only">Paso {index + 1}: </span>
              {step.title}
            </p>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
