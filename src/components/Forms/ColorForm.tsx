"use client";

import { createColor } from "@/actions";
import { Color } from "@/interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";

interface Props {
  colors: Color[];
  onSubmit: (data: Color) => void;
  onCancel: () => void;
}

const colorSchema = z.object({
  name: z.string().min(3, "El nombre es obligatorio"),
  hex: z.string().regex(/^#([0-9A-Fa-f]{6})$/, "Color inválido"),
});
type FormInputs = z.infer<typeof colorSchema>;

export const ColorForm = ({
  colors,
  onSubmit: notifyParent,
  onCancel,
}: Props) => {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormInputs>({
    resolver: zodResolver(colorSchema),
    defaultValues: {
      name: "",
      hex: "#000000",
    },
  });

  const selectedColor = watch("hex");

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setSaving(true);
    try {
      const nameExists = colors.some(
        (c) => c.color.toLowerCase().trim() === data.name.toLowerCase().trim(),
      );
      if (nameExists) {
        alert("Nombre ya usado");
        return;
      }

      const hexExists = colors.some((c) => c.hex === data.hex);
      if (hexExists) {
        alert("Color ya usado");
        return;
      }

      const colorToSave = {
        color: data.name,
        hex: data.hex,
      };
      const result = await createColor(colorToSave);

      if (result.ok && result.color) {
        notifyParent(result.color);
      } else {
        console.error(result.message);
        alert(result.message);
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
      <div className="space-y-2">
        <label className="block text-sm font-medium">Nombre del color *</label>
        <input
          type="text"
          {...register("name")}
          className={`w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:border-primary ${
            errors.name ? "border-red-500" : "border-border"
          }`}
          placeholder="Ej: Rojo vino"
        />
        {errors.name && (
          <span className="text-xs text-red-500">{errors.name.message}</span>
        )}
      </div>

      {/* Color picker */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Color *</label>

        <div className="flex items-center gap-4">
          <input
            type="color"
            {...register("hex")}
            className="h-12 w-16 rounded-lg border cursor-pointer"
          />

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedColor}
            </span>
            <div
              className="h-6 w-6 rounded-full border"
              style={{ backgroundColor: selectedColor }}
            />
          </div>
        </div>

        {errors.hex && (
          <span className="text-xs text-red-500">{errors.hex.message}</span>
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
          className="px-5 py-2 rounded-xl bg-primary text-white font-medium hover:scale-[1.02] transition"
        >
          Guardar
        </button>
      </div>
    </form>
  );
};
