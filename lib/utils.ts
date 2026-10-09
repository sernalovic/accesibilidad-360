export { cn } from "cn";

const mediumDateFormatter = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" });

// Fecha en formato medio es-ES, compartida para no duplicarla
// en cada componente que muestra fechas.
export function formatMediumDate(date: Date): string {
  return mediumDateFormatter.format(date);
}

// Etiqueta legible del rol para la interfaz (los valores USER,
// MODERATOR y ADMIN son códigos internos, no texto de usuario).
export function roleLabel(role: string): string {
  if (role === "ADMIN") {
    return "Administrador";
  }
  if (role === "MODERATOR") {
    return "Moderador";
  }
  return "Usuario";
}
