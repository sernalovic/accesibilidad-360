"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "../schemas/login.schema";
import { loginUserAction } from "../actions/login.action";

const inputClassName = "w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-900";

// Formulario de inicio de sesión (SPEC-010 fase 010.4).
// El éxito redirige en servidor a /dashboard, por lo que aquí
// solo se gestiona el error con un único mensaje genérico.
export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginInput) => {
    setFormError(null);
    startTransition(async () => {
      const result = await loginUserAction(values);
      setFormError(result.message);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Formulario de inicio de sesión">
      {formError && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-red-800">
          {formError}
        </p>
      )}

      <div>
        <label htmlFor="login-email">Correo electrónico</label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "login-email-error" : undefined}
          className={inputClassName}
          {...register("email")}
        />
        {errors.email && (
          <p id="login-email-error" role="alert" className="text-red-800">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="login-password">Contraseña</label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? "login-password-error" : undefined}
          className={inputClassName}
          {...register("password")}
        />
        {errors.password && (
          <p id="login-password-error" role="alert" className="text-red-800">
            {errors.password.message}
          </p>
        )}
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? "Iniciando sesión…" : "Iniciar sesión"}
      </button>
    </form>
  );
}
