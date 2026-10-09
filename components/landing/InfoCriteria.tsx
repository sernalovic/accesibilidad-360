// Nombres oficiales de los criterios (ver `prisma/seed.ts`).
// No añadir variantes: esta lista es informativa, no consulta la base de datos.
const criteria = [
  "Acceso sin escalones",
  "Puerta accesible",
  "Anchura de paso",
  "Espacio de giro",
  "Aseo adaptado",
  "Ascensor accesible",
  "Aparcamiento para personas con movilidad reducida",
  "Señalización accesible",
] as const;

// Sección "Qué información encontrarás" (solo presentación).
export function InfoCriteria() {
  return (
    <section aria-label="Qué información encontrarás" className="space-y-4">
      <h2 className="text-2xl font-semibold">Qué información encontrarás</h2>
      <ul className="grid list-disc gap-2 pl-6 sm:grid-cols-2">
        {criteria.map((criterion) => (
          <li key={criterion}>{criterion}</li>
        ))}
      </ul>
      <p className="text-sm text-muted-foreground">
        Además, cada ficha puede incluir fotografías y comentarios de la comunidad.
      </p>
    </section>
  );
}
