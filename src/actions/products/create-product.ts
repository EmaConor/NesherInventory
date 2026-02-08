"use server";

import { InputProduct } from "@/interfaces";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config(process.env.CLOUDINARY_URL ?? "");

export const createProduct = async (product: InputProduct) => {
  console.log(product);
  try {
    let image = null;

    // uploadImage
    if (product.image) {
      try {
        image = await uploadImage(product.image);
        console.log("Image uploaded successfully:", image);
      } catch (e) {
        console.error("Error uploading image:", e);
        return {
          ok: false,
          message: "Error al subir la imagen",
        };
      }
    }

    let slug = product.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
      .replace(/[^a-z0-9]+/g, "-") // Reemplazar espacios y caracteres especiales con -
      .replace(/^-+|-+$/g, ""); // Eliminar guiones al inicio y final

    // Verificar si el slug ya existe y hacerlo único
    const baseSlug = slug;
    let counter = 1;
    let isUnique = false;

    while (!isUnique) {
      const existingProduct = await prisma.product.findUnique({
        where: { slug },
      });

      if (!existingProduct) {
        isUnique = true;
      } else {
        // Si el slug existe, agregar un número al final
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    const productToSave = {
      name: product.name,
      slug: slug,
      description: product.description,
      imageUrl: image ?? "",
      stock: product.stock,
      supplierPrice: product.supplierPrice,
      salePrice: product.salePrice,
      colorId: product.color.id,
      sizeId: product.size.id,
      collectionId: product.collection.id,
    };

    const savedProduct = await prisma.product.create({
      data: productToSave,
      include: {
        color: true,
        size: true,
        collection: true
      }
    });

    revalidatePath("/");
    return {
      ok: true,
      message: "Producto creado exitosamente",
      product: {
        ...savedProduct,
        supplierPrice: Number(savedProduct.supplierPrice.toFixed(2)),
        salePrice: Number(savedProduct.salePrice.toFixed(2)),
      },
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "No se pudo grabar el producto",
    };
  }
};

const uploadImage = async (image: File) => {
  try {
    const buffer = await image.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");

    return cloudinary.uploader
      .upload(`data:${image.type};base64,${base64Image}`)
      .then((r) => r.secure_url);
  } catch (e) {
    console.error(e);
    return null;
  }
};
