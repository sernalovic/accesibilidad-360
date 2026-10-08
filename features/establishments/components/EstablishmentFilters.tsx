"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CategoryOption } from "../services/category.service";
import type { MunicipalityOption, ProvinceOption } from "../services/geo.service";

export interface EstablishmentFilterValues {
  search: string;
  categoryId: string;
  provinceId: string;
  municipalityId: string;
  sort: string;
}

export interface SortOption {
  value: string;
  label: string;
}

interface EstablishmentFiltersProps {
  categories: CategoryOption[];
  provinces: ProvinceOption[];
  municipalities: MunicipalityOption[];
  values: EstablishmentFilterValues;
  sortOptions: SortOption[];
}

// Filtros de búsqueda (SPEC-070). Formulario GET nativo: los filtros
// viajan en la URL sin JavaScript ni AJAX. El municipio se filtra en
// cliente según la provincia (datos servidos una vez).
export function EstablishmentFilters({
  categories,
  provinces,
  municipalities,
  values,
  sortOptions,
}: EstablishmentFiltersProps) {
  const [provinceId, setProvinceId] = useState(values.provinceId);
  const visibleMunicipalities = provinceId
    ? municipalities.filter((municipality) => municipality.provinceId === provinceId)
    : [];

  return (
    <form
      method="get"
      action="/establishments"
      aria-label="Filtros de búsqueda"
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="filter-search">Buscar por nombre</Label>
        <Input
          id="filter-search"
          name="search"
          type="search"
          defaultValue={values.search}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="filter-category">Categoría</Label>
          <select
            id="filter-category"
            name="category"
            defaultValue={values.categoryId}
            className="w-full rounded-md border px-3 py-2 text-sm"
          >
            <option value="">Todas</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-province">Provincia</Label>
          <select
            id="filter-province"
            name="province"
            value={provinceId}
            onChange={(event) => setProvinceId(event.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          >
            <option value="">Todas</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-municipality">Municipio</Label>
          <select
            id="filter-municipality"
            name="municipality"
            key={provinceId}
            defaultValue={values.municipalityId}
            disabled={!provinceId}
            className="w-full rounded-md border px-3 py-2 text-sm"
          >
            <option value="">Todos</option>
            {visibleMunicipalities.map((municipality) => (
              <option key={municipality.id} value={municipality.id}>
                {municipality.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-sort">Ordenar por</Label>
          <select
            id="filter-sort"
            name="sort"
            defaultValue={values.sort}
            className="w-full rounded-md border px-3 py-2 text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit">Aplicar filtros</Button>
        <Link href="/establishments" className={buttonVariants({ variant: "outline" })}>
          Limpiar
        </Link>
      </div>
    </form>
  );
}
