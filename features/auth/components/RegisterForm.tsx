"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema, type RegisterInput } from "../schemas/register.schema";
import { registerUserAction } from "../actions/register.action";

// Formulario de registro (Sprint UI-001: shadcn/ui).
// Misma lógica y accesibilidad; solo cambia la presentación.
export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = (values: RegisterInput) => {
    setFormError(null);
    startTransition(async () => {
      const result = await registerUserAction(values);
      if (result.success) {
        router.push("/login?registered=true");
        return;
      }
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          if (messages?.[0]) {
            setError(field as keyof RegisterInput, { message: messages[0] });
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
      aria-label="Formulario de registro"
      className="space-y-4"
    >
      {formError && (
        <p role="alert" className="rounded-md border px-3 py-2 text-sm">
          {formError}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="register-name">
          Nombre <span aria-hidden="true">*</span>
        </Label>
        <Input
          id="register-name"
          type="text"
          autoComplete="name"
          aria-required="true"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "register-name-error" : undefined}
          {...register("name")}
        />
        {errors.name && (
          <p id="register-name-error" role="alert" className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-email">
          Correo electrónico <span aria-hidden="true">*</span>
        </Label>
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          aria-required="true"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "register-email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="register-email-error" role="alert" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password">
          Contraseña <span aria-hidden="true">*</span>
        </Label>
        <Input
          id="register-password"
          type="password"
          autoComplete="new-password"
          aria-required="true"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? "register-password-error" : undefined}
          {...register("password")}
        />
        {errors.password && (
          <p id="register-password-error" role="alert" className="text-sm text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-confirm">
          Confirmar contraseña <span aria-hidden="true">*</span>
        </Label>
        <Input
          id="register-confirm"
          type="password"
          autoComplete="new-password"
          aria-required="true"
          aria-invalid={errors.confirmPassword ? true : undefined}
          aria-describedby={errors.confirmPassword ? "register-confirm-error" : undefined}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p id="register-confirm-error" role="alert" className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Creando cuenta…" : "Crear cuenta"}
      </Button>
    </form>
  );
}
