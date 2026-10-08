import type { Role } from "@prisma/client";

export interface Actor {
  id: string;
  role: Role;
}

// ¿Es administrador? (SPEC-110). Base de todas las comprobaciones
// de administración. Siempre en servidor; nunca en el cliente.
export function isAdmin(actor: Actor): boolean {
  return actor.role === "ADMIN";
}

// ¿Puede gestionar un recurso ajeno? Creador o administrador.
// Misma regla para establecimientos, fotografías y valoraciones;
// cada servicio la aplica contra el propietario persistido.
export function canManageOwnerOrAdmin(actor: Actor, ownerId: string): boolean {
  return actor.id === ownerId || isAdmin(actor);
}
