"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteEstablishmentAction } from "../actions/delete-establishment.action";

// Botón de eliminación (SPEC-080).
// Requiere confirmación nativa; el permiso real se comprueba en servidor.
export function DeleteEstablishmentButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onDelete = () => {
    if (!window.confirm("¿Eliminar este establecimiento? Esta acción no se puede deshacer.")) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await deleteEstablishmentAction(id);
      if (result.success) {
        router.push("/establishments");
        return;
      }
      setError(result.message);
    });
  };

  return (
    <div>
      <Button type="button" variant="destructive" disabled={isPending} onClick={onDelete}>
        {isPending ? "Eliminando…" : "Eliminar"}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
