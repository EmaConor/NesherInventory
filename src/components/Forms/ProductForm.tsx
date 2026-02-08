"use client";

import { Collection, Color, InputProduct, Product, Size } from "@/interfaces";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { createProduct, updateProduct } from "@/actions";
import { Modal } from "../ui/Modal";
import { ColorForm } from "./ColorForm";
import { SizeForm } from "./SizeForm";
import { CollectionForm } from "./CollectionForm";

interface Props {
  product?: Product | null;
  onSubmit: (data: Product) => void;
  onCancel: () => void;
  colors: Color[];
  sizes: Size[];
  collections: Collection[];
}

const productSchema = z
  .object({
    name: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(100, "El nombre no puede exceder los 100 caracteres"),
    description: z.string().optional(),
    image: z.instanceof(File).nullable().optional(),
    stock: z
      .number()
      .int("Debe ser un número entero")
      .min(0, "El stock no puede ser negativo")
      .max(100000, "El stock no puede exceder 100,000"),
    supplierPrice: z
      .number()
      .min(0.01, "Precio de proveedor obligatorio")
      .max(1000000, "El precio es demasiado alto"),
    salePrice: z
      .number()
      .min(0.01, "Precio de venta obligatorio")
      .max(1000000, "El precio es demasiado alto"),
    colorId: z
      .number()
      .min(1, "Seleccione un color")
      .int("Debe ser un ID válido"),
    sizeId: z
      .number()
      .min(1, "Seleccione una talla")
      .int("Debe ser un ID válido"),
    collectionId: z
      .number()
      .min(1, "Seleccione una categoría")
      .int("Debe ser un ID válido"),
  })
  .refine(
    (data) =>
      data.supplierPrice !== undefined &&
      data.salePrice !== undefined &&
      data.salePrice >= data.supplierPrice,
    {
      message:
        "El precio de venta debe ser mayor o igual al precio de proveedor",
      path: ["salePrice"],
    },
  );

type FormInputs = z.infer<typeof productSchema>;

export const ProductForm = ({
  product,
  onSubmit: notifyParent,
  onCancel,
  colors,
  sizes,
  collections,
}: Props) => {
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    product?.imageUrl || null,
  );
  const [imageChanged, setImageChanged] = useState(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<FormInputs>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      image: null,
      stock: product?.stock ?? 0,
      supplierPrice: product?.supplierPrice ?? undefined,
      salePrice: product?.salePrice ?? undefined,
      colorId: product?.color.id ?? 0,
      sizeId: product?.size.id ?? 0,
      collectionId: product?.collection.id ?? 0,
    },
  });

  // Manejar selección de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageChanged(false);
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      alert("Solo se permiten imágenes JPG, PNG o WebP");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("La imagen no puede exceder los 5MB");
      return;
    }

    setImageChanged(true);
    setValue("image", file);

    // Crear preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Función para subir imagen a Cloudinary

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    console.log(data);

    setSaving(true);

    try {
      const selectedCollection = collections.find(
        (c) => c.id === data.collectionId,
      );
      if (!selectedCollection) {
        console.error("Categoría inválido");
        return;
      }

      const selectedColor = colors.find((c) => c.id === data.colorId);
      if (!selectedColor) {
        console.error("Color inválido");
        return;
      }

      const selectedSize = sizes.find((c) => c.id === data.sizeId);
      if (!selectedSize) {
        console.error("Talla inválida");
        return;
      }

      const dataForm: InputProduct = {
        ...data,
        id: product?.id ?? "",
        imageChanged: imageChanged,
        color: selectedColor,
        size: selectedSize,
        collection: selectedCollection,
      };

      const result = product?.id
        ? // EDITAR
          await updateProduct(dataForm)
        : // CREAR
          await createProduct(dataForm);

      if (result.ok && result.product) {
        notifyParent(result.product);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Imagen del Producto */}
        <div className="space-y-4">
          <label className="block text-sm font-medium">
            Imagen del Producto
          </label>
          <div className="flex gap-4 items-start">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted border-2 border-dashed border-border flex items-center justify-center">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Preview"
                  fill
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-muted-foreground text-xs">Preview</span>
              )}
            </div>
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                className="cursor-pointer block w-full text-sm text-muted-foreground
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-medium
                file:bg-primary file:text-primary-foreground
                hover:file:bg-primary/90"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Sube una Imagen.
              </p>
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Nombre del producto *
          </label>
          <input
            id="name"
            className={`w-full px-2 py-2 rounded-xl border bg-background focus:outline-none focus:border-primary ${errors.name ? "border-destructive" : "border-border"}`}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Name */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Descripción del producto
          </label>
          <textarea
            id="description"
            rows={3}
            className={`w-full px-2 py-2 rounded-xl border bg-background focus:outline-none focus:border-primary ${errors.description ? "border-destructive" : "border-border"}`}
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Color & Size */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Color *</label>

            <div className="flex gap-2">
              <select
                className={`w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:border-primary ${errors.colorId ? "border-red-500" : "border-border"}`}
                {...register("colorId", { valueAsNumber: true })}
              >
                <option disabled value="0">
                  [ Seleccione ]
                </option>
                {colors.map((color) => (
                  <option key={color.id} value={color.id}>
                    {color.color}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsColorModalOpen(true)}
                className="px-4 py-3 rounded-xl border bg-background border-border hover:bg-muted transition"
                title="Agregar color"
              >
                +
              </button>
            </div>
            {errors.colorId && (
              <span className="text-xs text-red-500">
                {errors.colorId.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Talla *</label>

            <div className="flex gap-2">
              <select
                className={`w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:border-primary ${errors.sizeId ? "border-red-500" : "border-border"}`}
                {...register("sizeId", { valueAsNumber: true })}
              >
                <option disabled value="0">
                  [ Seleccione ]
                </option>
                {sizes.map((size) => (
                  <option key={size.id} value={size.id}>
                    {size.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsSizeModalOpen(true)}
                className="px-4 py-3 rounded-xl border bg-background border-border hover:bg-muted transition"
                title="Agregar talla"
              >
                +
              </button>
            </div>
            {errors.sizeId && (
              <span className="text-xs text-red-500">
                {errors.sizeId.message}
              </span>
            )}
          </div>
        </div>

        {/* Collection*/}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Categoría *</label>

          <div className="flex gap-2">
            <select
              className={`w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:border-primary ${errors.collectionId ? "border-red-500" : "border-border"}`}
              {...register("collectionId", { valueAsNumber: true })}
            >
              <option disabled value="0">
                [ Seleccione ]
              </option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setIsCollectionModalOpen(true)}
              className="px-4 py-3 rounded-xl border border-border bg-background hover:bg-muted transition"
              title="Agregar categoría"
            >
              +
            </button>
          </div>

          {errors.collectionId && (
            <span className="text-xs text-red-500">
              {errors.collectionId.message}
            </span>
          )}
        </div>

        {/* Stock */}
        <div className="space-y-2">
          <label htmlFor="stock">Cantidad en inventario *</label>
          <input
            id="stock"
            type="number"
            min={0}
            className={`w-full px-2 py-2 rounded-xl border bg-background focus:outline-none focus:border-primary ${errors.stock ? "border-destructive" : "border-border"}`}
            {...register("stock", { valueAsNumber: true })}
          />
          {errors.stock && (
            <p className="text-xs text-destructive">{errors.stock.message}</p>
          )}
        </div>

        {/* Prices */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="supplier_price">Precio proveedor (USD) *</label>
            <input
              id="supplier_price"
              type="number"
              step="0.01"
              min="0"
              className={`w-full px-2 py-2 rounded-xl border bg-background focus:outline-none focus:border-primary ${errors.supplierPrice ? "border-destructive" : "border-border"}`}
              {...register("supplierPrice", { valueAsNumber: true })}
            />
            {errors.supplierPrice && (
              <p className="text-xs text-destructive">
                {errors.supplierPrice.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="sale_price">Precio venta (USD) *</label>
            <input
              id="sale_price"
              type="number"
              step="0.01"
              min="0"
              className={`w-full px-2 py-2 rounded-xl border bg-background focus:outline-none focus:border-primary ${errors.salePrice ? "border-destructive" : "border-border"}`}
              {...register("salePrice", { valueAsNumber: true })}
            />
            {errors.salePrice && (
              <p className="text-xs text-destructive">
                {errors.salePrice.message}
              </p>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Guardando..." : "Guardar Producto"}
          </button>
        </div>
      </form>

      {/* Modal para agregar Color */}
      <Modal
        isOpen={isColorModalOpen}
        onClose={() => setIsColorModalOpen(false)}
        title={"Agregar Nuevo Color"}
      >
        <ColorForm
          colors={colors}
          onCancel={() => setIsColorModalOpen(false)}
          onSubmit={(color) => {
            setValue("colorId", 0);
            setIsColorModalOpen(false);
          }}
        />
      </Modal>

      {/* Modal para agregar Talla */}
      <Modal
        isOpen={isSizeModalOpen}
        onClose={() => setIsSizeModalOpen(false)}
        title="Agregar Nueva Talla"
      >
        <SizeForm
          sizes={sizes}
          onCancel={() => setIsSizeModalOpen(false)}
          onSubmit={(size) => {
            setValue("sizeId", 0);
            setIsSizeModalOpen(false);
          }}
        />
      </Modal>

      {/* Modal para agregar Categoría */}
      <Modal
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        title="Agregar Nueva Categoría"
      >
        <CollectionForm
          collections={collections}
          onCancel={() => setIsCollectionModalOpen(false)}
          onSubmit={(collection) => {
            setValue("collectionId", 0);
            setIsCollectionModalOpen(false);
          }}
        />
      </Modal>
    </>
  );
};
