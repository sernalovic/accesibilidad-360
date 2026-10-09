"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadPhotoAction } from "../actions/upload-photo.action";
import { initialUploadPhotoState } from "../actions/upload-photo.types";

interface PhotoUploadFormProps {
  establishmentId: string;
}

// Formulario de subida (SPEC-050 + SPEC-120).
// Un único archivo por acción; sin drag & drop ni previsualización.
// Siempre visible: la galería admite hasta 10 fotografías.
export function PhotoUploadForm({ establishmentId }: PhotoUploadFormProps) {
  const [state, submit, isPending] = useActionState(uploadPhotoAction, initialUploadPhotoState);

  return (
    <form action={submit} aria-label="Formulario de fotografía">
      <input type="hidden" name="establishmentId" value={establishmentId} />
      <fieldset disabled={isPending}>
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
        <Button type="submit" disabled={isPending}>
          {isPending ? "Subiendo…" : "Subir fotografía"}
        </Button>
      </fieldset>
      {state.message && <p role={state.success ? "status" : "alert"}>{state.message}</p>}
    </form>
  );
}
