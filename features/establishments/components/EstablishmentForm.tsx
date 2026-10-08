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
import { updateEstablishmentAction } from "../actions/update-establishment.action";
import type { CategoryOption } from "../services/category.service";
import type { MunicipalityOption, ProvinceOption } from "../services/geo.service";

interface EstablishmentFormProps {
  categories: CategoryOption[];
  provinces: ProvinceOption[];
  municipalities: MunicipalityOption[];
  mode?: "create" | "edit";
  establishmentId?: string;
  initialValues?: EstablishmentInput;
}

// Formulario de ficha (SPEC-030 + SPEC-035 + SPEC-080).
// Mismo esquema, selects y estilos en creación y edición.
// En edición parte de los valores actuales y vuelve a la ficha.
export function EstablishmentForm({
  categories,
  provinces,
  municipalities,
  mode = "create",
  establishmentId,
  initialValues,
}: EstablishmentFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<EstablishmentInput>({
    resolver: zodResolver(establishmentSchema),
    defaultValues: initialValues ?? {
      name: "",
      categoryId: "",
      address: "",
      provinceId: "",
      municipalityId: "",
      description: "",
    },
  });

  const selectedProvinceId = watch("provinceId");
  const visibleMunicipalities = selectedProvinceId
    ? municipalities.filter((municipality) => municipality.provinceId === selectedProvinceId)
    : [];

  const { onChange: onProvinceChange, ...provinceRegister } = register("provinceId");

  const onSubmit = (values: EstablishmentInput) => {
    setFormError(null);
    startTransition(async () => {
      const result =
        mode === "edit" && establishmentId
          ? await updateEstablishmentAction(establishmentId, values)
          : await createEstablishmentAction(values);
      if (result.success) {
        router.push(
          mode === "edit" && establishmentId
            ? `/establishments/${establishmentId}`
            : "/establishments",
        );
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
        <Label htmlFor="establishment-province">Provincia</Label>
        <select
          id="establishment-province"
          aria-invalid={errors.provinceId ? true : undefined}
          aria-describedby={errors.provinceId ? "establishment-province-error" : undefined}
          className="w-full rounded-md border px-3 py-2 text-sm"
          onChange={(event) => {
            onProvinceChange(event);
            setValue("municipalityId", "");
          }}
          {...provinceRegister}
        >
          <option value="">Selecciona una provincia</option>
          {provinces.map((province) => (
            <option key={province.id} value={province.id}>
              {province.name}
            </option>
          ))}
        </select>
        {errors.provinceId && (
          <p id="establishment-province-error" role="alert" className="text-sm text-destructive">
            {errors.provinceId.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="establishment-municipality">Municipio</Label>
        <select
          id="establishment-municipality"
          disabled={!selectedProvinceId}
          aria-invalid={errors.municipalityId ? true : undefined}
          aria-describedby={errors.municipalityId ? "establishment-municipality-error" : undefined}
          className="w-full rounded-md border px-3 py-2 text-sm"
          {...register("municipalityId")}
        >
          <option value="">
            {selectedProvinceId ? "Selecciona un municipio" : "Primero elige una provincia"}
          </option>
          {visibleMunicipalities.map((municipality) => (
            <option key={municipality.id} value={municipality.id}>
              {municipality.name}
            </option>
          ))}
        </select>
        {errors.municipalityId && (
          <p
            id="establishment-municipality-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {errors.municipalityId.message}
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
        {isPending ? "Guardando…" : mode === "edit" ? "Guardar cambios" : "Guardar establecimiento"}
      </Button>
    </form>
  );
}
