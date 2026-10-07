"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { establishmentSchema, type EstablishmentInput } from "../schemas/establishment.schema";
import { createEstablishmentAction } from "../actions/create-establishment.action";
import type { CategoryOption } from "../services/category.service";

interface EstablishmentFormProps {
  categories: CategoryOption[];
}

// Formulario de nueva ficha (Sprint UI-001: shadcn/ui).
// Misma lógica y accesibilidad; solo cambia la presentación.
// El desplegable sigue siendo un <select> nativo (sin componente
// oficial permitido para ello en esta fase).
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Formulario de establecimiento"
      className="space-y-4"
    >
      {formError && (
        <p role="alert" className="rounded-md border px-3 py-2 text-sm">
          {formError}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="establishment-name">Nombre</Label>
        <Input
          id="establishment-name"
          type="text"
          autoComplete="off"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "establishment-name-error" : undefined}
          {...register("name")}
        />
        {errors.name && (
          <p id="establishment-name-error" role="alert" className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="establishment-category">Categoría</Label>
        <select
          id="establishment-category"
          aria-invalid={errors.categoryId ? true : undefined}
          aria-describedby={errors.categoryId ? "establishment-category-error" : undefined}
          className="w-full rounded-md border px-3 py-2 text-sm"
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
          <p id="establishment-category-error" role="alert" className="text-sm text-destructive">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="establishment-address">Dirección</Label>
        <Input
          id="establishment-address"
          type="text"
          autoComplete="street-address"
          aria-invalid={errors.address ? true : undefined}
          aria-describedby={errors.address ? "establishment-address-error" : undefined}
          {...register("address")}
        />
        {errors.address && (
          <p id="establishment-address-error" role="alert" className="text-sm text-destructive">
            {errors.address.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="establishment-municipality">Municipio</Label>
        <Input
          id="establishment-municipality"
          type="text"
          autoComplete="address-level2"
          aria-invalid={errors.municipality ? true : undefined}
          aria-describedby={errors.municipality ? "establishment-municipality-error" : undefined}
          {...register("municipality")}
        />
        {errors.municipality && (
          <p
            id="establishment-municipality-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {errors.municipality.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="establishment-province">Provincia</Label>
        <Input
          id="establishment-province"
          type="text"
          autoComplete="address-level1"
          aria-invalid={errors.province ? true : undefined}
          aria-describedby={errors.province ? "establishment-province-error" : undefined}
          {...register("province")}
        />
        {errors.province && (
          <p id="establishment-province-error" role="alert" className="text-sm text-destructive">
            {errors.province.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="establishment-description">Descripción (opcional)</Label>
        <Textarea
          id="establishment-description"
          aria-invalid={errors.description ? true : undefined}
          aria-describedby={errors.description ? "establishment-description-error" : undefined}
          {...register("description")}
        />
        {errors.description && (
          <p id="establishment-description-error" role="alert" className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Guardando…" : "Guardar establecimiento"}
      </Button>
    </form>
  );
}
