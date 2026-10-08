"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCategoryAction } from "../actions/create-category.action";
import { deleteCategoryAction } from "../actions/delete-category.action";
import { updateCategoryAction } from "../actions/update-category.action";
import type { CategoryWithUsage } from "../services/category.service";

// Gestión de categorías (SPEC-110, solo ADMIN verificado en servidor).
// Crear, renombrar inline y eliminar con confirmación.
export function CategoryManager({ initialCategories }: { initialCategories: CategoryWithUsage[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const refresh = () => router.refresh();

  const onCreate = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    startTransition(async () => {
      const result = await createCategoryAction(newName);
      if (result.success) {
        setNewName("");
        refresh();
        return;
      }
      setFormError(result.message);
    });
  };

  const onRename = (id: string) => {
    setFormError(null);
    startTransition(async () => {
      const result = await updateCategoryAction(id, editingName);
      if (result.success) {
        setEditingId(null);
        refresh();
        return;
      }
      setFormError(result.message);
    });
  };

  const onDelete = (id: string, name: string) => {
    if (!window.confirm(`¿Eliminar la categoría «${name}»?`)) {
      return;
    }
    setFormError(null);
    startTransition(async () => {
      const result = await deleteCategoryAction(id);
      if (result.success) {
        refresh();
        return;
      }
      setFormError(result.message);
    });
  };

  return (
    <div className="space-y-4">
      {formError && (
        <p role="alert" className="rounded-md border px-3 py-2 text-sm">
          {formError}
        </p>
      )}

      <form onSubmit={onCreate} aria-label="Crear categoría" className="flex gap-2">
        <div className="flex-1 space-y-2">
          <Label htmlFor="category-name">Nueva categoría</Label>
          <Input
            id="category-name"
            type="text"
            autoComplete="off"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
          />
        </div>
        <Button type="submit" disabled={isPending} className="self-end">
          Crear
        </Button>
      </form>

      <ul className="space-y-2">
        {initialCategories.map((category) => (
          <li key={category.id} className="flex items-center gap-2">
            {editingId === category.id ? (
              <>
                <Input
                  aria-label={`Nombre de ${category.name}`}
                  type="text"
                  autoComplete="off"
                  value={editingName}
                  onChange={(event) => setEditingName(event.target.value)}
                />
                <Button type="button" disabled={isPending} onClick={() => onRename(category.id)}>
                  Guardar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => setEditingId(null)}
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1">
                  {category.name} ({category.establishmentCount})
                </span>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => {
                    setEditingId(category.id);
                    setEditingName(category.name);
                  }}
                >
                  Editar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isPending}
                  onClick={() => onDelete(category.id, category.name)}
                >
                  Eliminar
                </Button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
