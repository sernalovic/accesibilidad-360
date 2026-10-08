"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteReviewAction } from "../actions/delete-review.action";

// Borrado de valoración (SPEC-110, sin edición).
// Requiere confirmación; el permiso real se comprueba en servidor.
export function DeleteReviewButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onDelete = () => {
    if (!window.confirm("¿Eliminar esta valoración? Esta acción no se puede deshacer.")) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await deleteReviewAction(id);
      if (result.success) {
        router.refresh();
        return;
      }
      setError(result.message);
    });
  };

  return (
    <div>
      <Button type="button" variant="destructive" disabled={isPending} onClick={onDelete}>
        {isPending ? "Eliminando…" : "Eliminar valoración"}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
