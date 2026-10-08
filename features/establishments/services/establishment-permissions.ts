import type { Role } from "@prisma/client";

export interface EstablishmentActor {
  id: string;
  role: Role;
}

export class EstablishmentNotFoundError extends Error {
  readonly code = "ESTABLISHMENT_NOT_FOUND" as const;

  constructor() {
    super("El establecimiento no existe.");
    this.name = "EstablishmentNotFoundError";
  }
}

export class ForbiddenEstablishmentError extends Error {
  readonly code = "FORBIDDEN_ESTABLISHMENT" as const;

  constructor() {
    super("No tienes permiso para modificar este establecimiento.");
    this.name = "ForbiddenEstablishmentError";
  }
}

// Solo el creador o un administrador (SPEC-080).
// Pura y testeable; la comprobación definitiva ocurre en servidor
// contra el createdById persistido, nunca con datos del cliente.
export function canManageEstablishment(actor: EstablishmentActor, ownerId: string): boolean {
  return actor.id === ownerId || actor.role === "ADMIN";
}
