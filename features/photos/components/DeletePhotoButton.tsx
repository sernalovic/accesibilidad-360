"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deletePhotoAction } from "../actions/delete-photo.action";

// Borrado de fotografía (SPEC-110). Requiere confirmación;
// el permiso real se comprueba en servidor.
export function DeletePhotoButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onDelete = () => {
    if (!window.confirm("¿Eliminar esta fotografía? Esta acción no se puede deshacer.")) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await deletePhotoAction(id);
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
        {isPending ? "Eliminando…" : "Eliminar fotografía"}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
