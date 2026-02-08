"use client";

import { createSize } from "@/actions";
import { Size } from "@/interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";

interface Props {
  sizes: Size[];
  onSubmit: (data: Size) => void;
  onCancel: () => void;
}

const sizeSchema = z.object({
  label: z.string().min(1, "La talla es obligatoria"),
});

type FormInputs = z.infer<typeof sizeSchema>;

export const SizeForm = ({ sizes, onSubmit: notifyParent, onCancel }: Props) => {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(sizeSchema),
    defaultValues: {
      label: "",
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setSaving(true);

    try {
      const exists = sizes.some(
        (s) => s.label.toLowerCase().trim() === data.label.toLowerCase().trim()
      );

      if (exists) {
        alert("La talla ya existe");
        return;
      }

      const result = await createSize({
        label: data.label.trim(),
      });

      if (result.ok && result.size) {
        notifyParent(result.size);
      } else {
        alert(result.message ?? "Error al crear la talla");
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
      {/* Label */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Talla *</label>
        <input
          type="text"
          {...register("label")}
          placeholder="Ej: S, M, L, XL, 42"
          className={`w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:border-primary ${
            errors.label ? "border-red-500" : "border-border"
          }`}
        />
        {errors.label && (
          <span className="text-xs text-red-500">{errors.label.message}</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
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
