"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePasswordSchema, type ChangePasswordInput } from "../schemas/change-password.schema";
import { changePasswordAction } from "../actions/change-password.action";

// Formulario de cambio de contraseña (SPEC-125).
// Solo para cuentas con contraseña local. Mismo patrón y
// accesibilidad que el resto de formularios del proyecto.
export function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = (values: ChangePasswordInput) => {
    setFormError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await changePasswordAction(values);
      if (result.success) {
        reset();
        setSuccess("Contraseña actualizada correctamente.");
        return;
      }
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          if (messages?.[0]) {
            setError(field as keyof ChangePasswordInput, { message: messages[0] });
          }
        }
      }
      setFormError(result.message);
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Formulario de cambio de contraseña"
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
        <Label htmlFor="password-current">
          Contraseña actual <span aria-hidden="true">*</span>
        </Label>
        <Input
          id="password-current"
          type="password"
          autoComplete="current-password"
          aria-required="true"
          aria-invalid={errors.currentPassword ? true : undefined}
          aria-describedby={errors.currentPassword ? "password-current-error" : undefined}
          {...register("currentPassword")}
        />
        {errors.currentPassword && (
          <p id="password-current-error" role="alert" className="text-sm text-destructive">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password-new">
          Nueva contraseña <span aria-hidden="true">*</span>
        </Label>
        <Input
          id="password-new"
          type="password"
          autoComplete="new-password"
          aria-required="true"
          aria-invalid={errors.newPassword ? true : undefined}
          aria-describedby={errors.newPassword ? "password-new-error" : undefined}
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <p id="password-new-error" role="alert" className="text-sm text-destructive">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password-confirm">
          Confirmar contraseña <span aria-hidden="true">*</span>
        </Label>
        <Input
          id="password-confirm"
          type="password"
          autoComplete="new-password"
          aria-required="true"
          aria-invalid={errors.confirmPassword ? true : undefined}
          aria-describedby={errors.confirmPassword ? "password-confirm-error" : undefined}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p id="password-confirm-error" role="alert" className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Actualizando…" : "Cambiar contraseña"}
      </Button>
    </form>
  );
}
