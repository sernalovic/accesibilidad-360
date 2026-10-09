"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profileNameSchema, type ProfileNameInput } from "../schemas/profile-name.schema";
import { updateNameAction } from "../actions/update-name.action";

// Formulario de edición del nombre (SPEC-125).
// Mismo patrón y accesibilidad que el resto de formularios:
// React Hook Form + Zod + Server Action.
export function UpdateNameForm({ defaultName }: { defaultName: string }) {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProfileNameInput>({
    resolver: zodResolver(profileNameSchema),
    defaultValues: { name: defaultName },
  });

  const onSubmit = (values: ProfileNameInput) => {
    setFormError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await updateNameAction(values);
      if (result.success) {
        setSuccess("Nombre actualizado correctamente.");
        return;
      }
      if (result.fieldErrors?.name?.[0]) {
        setError("name", { message: result.fieldErrors.name[0] });
      }
      setFormError(result.message);
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Formulario de edición del nombre"
      className="space-y-4"
    >
      {formError && (
        <p role="alert" className="rounded-md border px-3 py-2 text-sm">
          {formError}
        </p>
      )}
      {success && (
        <p role="status" className="rounded-md border px-3 py-2 text-sm">
          {success}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="profile-name">
          Nombre <span aria-hidden="true">*</span>
        </Label>
        <Input
          id="profile-name"
          type="text"
          autoComplete="name"
          aria-required="true"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "profile-name-error" : undefined}
          {...register("name")}
        />
        {errors.name && (
          <p id="profile-name-error" role="alert" className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando…" : "Guardar nombre"}
      </Button>
    </form>
  );
}
