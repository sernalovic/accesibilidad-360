"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { establishmentSchema, type EstablishmentInput } from "../schemas/establishment.schema";
import { createEstablishmentAction } from "../actions/create-establishment.action";
import type { CategoryOption } from "../services/category.service";

const inputClassName = "w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-900";

interface EstablishmentFormProps {
  categories: CategoryOption[];
}

// Formulario de nueva ficha (SPEC-030).
// Las categorías llegan del servidor; la autoría la aporta la sesión.
export function EstablishmentForm({ categories }: EstablishmentFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EstablishmentInput>({
    resolver: zodResolver(establishmentSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      address: "",
      municipality: "",
      province: "",
      description: "",
    },
  });

  const onSubmit = (values: EstablishmentInput) => {
    setFormError(null);
    startTransition(async () => {
      const result = await createEstablishmentAction(values);
      if (result.success) {
        router.push("/establishments");
        return;
      }
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          if (messages?.[0]) {
            setError(field as keyof EstablishmentInput, { message: messages[0] });
          }
        }
      }
      setFormError(result.message);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Formulario de establecimiento">
      {formError && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-red-800">
          {formError}
        </p>
      )}

      <div>
        <label htmlFor="establishment-name">Nombre</label>
        <input
          id="establishment-name"
          type="text"
          autoComplete="off"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "establishment-name-error" : undefined}
          className={inputClassName}
          {...register("name")}
        />
        {errors.name && (
          <p id="establishment-name-error" role="alert" className="text-red-800">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="establishment-category">Categoría</label>
        <select
          id="establishment-category"
          aria-invalid={errors.categoryId ? true : undefined}
          aria-describedby={errors.categoryId ? "establishment-category-error" : undefined}
          className={inputClassName}
          {...register("categoryId")}
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p id="establishment-category-error" role="alert" className="text-red-800">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="establishment-address">Dirección</label>
        <input
          id="establishment-address"
          type="text"
          autoComplete="street-address"
          aria-invalid={errors.address ? true : undefined}
          aria-describedby={errors.address ? "establishment-address-error" : undefined}
          className={inputClassName}
          {...register("address")}
        />
        {errors.address && (
          <p id="establishment-address-error" role="alert" className="text-red-800">
            {errors.address.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="establishment-municipality">Municipio</label>
        <input
          id="establishment-municipality"
          type="text"
          autoComplete="address-level2"
          aria-invalid={errors.municipality ? true : undefined}
          aria-describedby={errors.municipality ? "establishment-municipality-error" : undefined}
          className={inputClassName}
          {...register("municipality")}
        />
        {errors.municipality && (
          <p id="establishment-municipality-error" role="alert" className="text-red-800">
            {errors.municipality.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="establishment-province">Provincia</label>
        <input
          id="establishment-province"
          type="text"
          autoComplete="address-level1"
          aria-invalid={errors.province ? true : undefined}
          aria-describedby={errors.province ? "establishment-province-error" : undefined}
          className={inputClassName}
          {...register("province")}
        />
        {errors.province && (
          <p id="establishment-province-error" role="alert" className="text-red-800">
            {errors.province.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="establishment-description">Descripción (opcional)</label>
        <textarea
          id="establishment-description"
          aria-invalid={errors.description ? true : undefined}
          aria-describedby={errors.description ? "establishment-description-error" : undefined}
          className={inputClassName}
          {...register("description")}
        />
        {errors.description && (
          <p id="establishment-description-error" role="alert" className="text-red-800">
            {errors.description.message}
          </p>
        )}
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? "Guardando…" : "Guardar establecimiento"}
      </button>
    </form>
  );
}
