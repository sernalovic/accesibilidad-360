"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setPrimaryPhotoAction } from "../actions/set-primary-photo.action";

interface SetPrimaryPhotoButtonProps {
  id: string;
  ariaLabel: string;
  children: React.ReactNode;
}

// Fija la fotografía principal al pulsar su miniatura (SPEC-120).
// Botón nativo accesible por teclado; el permiso real es en servidor.
export function SetPrimaryPhotoButton({ id, ariaLabel, children }: SetPrimaryPhotoButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onSetPrimary = () => {
    setError(null);
    startTransition(async () => {
      const result = await setPrimaryPhotoAction(id);
      if (result.success) {
        router.refresh();
        return;
      }
      setError(result.message);
    });
  };

  return (
    <div>
      <button
        type="button"
        aria-label={ariaLabel}
        disabled={isPending}
        onClick={onSetPrimary}
        className="block w-full disabled:opacity-50"
      >
        {children}
      </button>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
