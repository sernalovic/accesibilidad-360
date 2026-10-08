export { cn } from "cn";

const mediumDateFormatter = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" });

// Fecha en formato medio es-ES, compartida para no duplicarla
// en cada componente que muestra fechas.
export function formatMediumDate(date: Date): string {
  return mediumDateFormatter.format(date);
}
