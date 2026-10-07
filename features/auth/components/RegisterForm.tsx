"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "../schemas/register.schema";
import { registerUserAction } from "../actions/register.action";

const inputClassName = "w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-900";

// Formulario de registro (SPEC-010 fase 010.3).
// Valida en cliente para la UX; el servidor revalida siempre.
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Formulario de registro">
      {formError && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-red-800">
          {formError}
        </p>
      )}

      <div>
        <label htmlFor="register-name">Nombre</label>
        <input
          id="register-name"
          type="text"
          autoComplete="name"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "register-name-error" : undefined}
          className={inputClassName}
          {...register("name")}
        />
        {errors.name && (
          <p id="register-name-error" role="alert" className="text-red-800">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="register-email">Correo electrónico</label>
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "register-email-error" : undefined}
          className={inputClassName}
          {...register("email")}
        />
        {errors.email && (
          <p id="register-email-error" role="alert" className="text-red-800">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="register-password">Contraseña</label>
        <input
          id="register-password"
          type="password"
          autoComplete="new-password"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? "register-password-error" : undefined}
          className={inputClassName}
          {...register("password")}
        />
        {errors.password && (
          <p id="register-password-error" role="alert" className="text-red-800">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="register-confirm">Confirmar contraseña</label>
        <input
          id="register-confirm"
          type="password"
          autoComplete="new-password"
          aria-invalid={errors.confirmPassword ? true : undefined}
          aria-describedby={errors.confirmPassword ? "register-confirm-error" : undefined}
          className={inputClassName}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p id="register-confirm-error" role="alert" className="text-red-800">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? "Creando cuenta…" : "Crear cuenta"}
      </button>
    </form>
  );
}
