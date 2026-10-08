"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialUploadPhotoState, uploadPhotoAction } from "../actions/upload-photo.action";

interface PhotoUploadFormProps {
  establishmentId: string;
  disabled?: boolean;
}

// Formulario de subida (SPEC-050, 1.ª entrega).
// Un único archivo; sin drag & drop ni previsualización.
// Deshabilitado (con mensaje) cuando ya existe fotografía.
export function PhotoUploadForm({ establishmentId, disabled = false }: PhotoUploadFormProps) {
  const [state, submit, isPending] = useActionState(uploadPhotoAction, initialUploadPhotoState);

  return (
    <form action={submit} aria-label="Formulario de fotografía">
      <input type="hidden" name="establishmentId" value={establishmentId} />
      <fieldset disabled={disabled || isPending}>
        <div className="space-y-2">
          <Label htmlFor="establishment-photo">Fotografía del establecimiento</Label>
          <Input
            id="establishment-photo"
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-describedby="establishment-photo-help"
          />
          <p id="establishment-photo-help">JPG, PNG o WebP de hasta 5 MB.</p>
        </div>
        <Button type="submit" disabled={disabled || isPending}>
          {isPending ? "Subiendo…" : "Subir fotografía"}
        </Button>
      </fieldset>
      {disabled && (
        <p>
          Este establecimiento ya tiene una fotografía. La gestión de múltiples fotografías llegará
          en una próxima fase.
        </p>
      )}
      {state.message && <p role={state.success ? "status" : "alert"}>{state.message}</p>}
    </form>
  );
}
