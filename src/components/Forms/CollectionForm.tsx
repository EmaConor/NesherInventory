"use client";

import { createCollection } from "@/actions";
import { Collection } from "@/interfaces";
import { slugify } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";

interface Props {
  collections: Collection[];
  onSubmit: (data: Collection) => void;
  onCancel: () => void;
}

const collectionSchema = z.object({
  name: z.string().min(3, "El nombre es obligatorio"),
});
type FormInputs = z.infer<typeof collectionSchema>;

export const CollectionForm = ({
  collections,
  onSubmit: notifyParent,
  onCancel,
}: Props) => {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setSaving(true);

    try {
      const slug = slugify(data.name);

      const exists = collections.some((c) => c.slug === slug);

      if (exists) {
        alert("La categoría ya existe");
        return;
      }

      const collectionToSave = {
        name: data.name,
        slug,
      };

      const result = await createCollection(collectionToSave);

      if (result.ok && result.collection) {
        notifyParent(result.collection);
      } else {
        alert(result.message ?? "Error al crear la categoría");
      }
    } catch (error) {
      console.error(error);
      alert("Error inesperado");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Nombre */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Nombre de la categoría *
        </label>

        <input
          type="text"
          {...register("name")}
          className={`w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:border-primary ${
            errors.name ? "border-red-500" : "border-border"
          }`}
          placeholder="Ej: Camisetas"
          disabled={saving}
        />

        {errors.name && (
          <span className="text-xs text-red-500">{errors.name.message}</span>
        )}
      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="px-4 py-2 rounded-xl border border-border hover:bg-muted transition"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 rounded-xl bg-primary text-white font-medium hover:scale-[1.02] transition disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
};
