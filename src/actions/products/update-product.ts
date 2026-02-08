"use server";

import { InputProduct } from "@/interfaces";
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
cloudinary.config(process.env.CLOUDINARY_URL ?? "");

export const updateProduct = async (product: InputProduct) => {
  let newImageUrl: string | null = null;

  try {
    console.log(product);

    if (product.imageChanged && product.image) {
      newImageUrl = await uploadImage(product.image);
      if (!newImageUrl) {
        throw new Error("Error subiendo la imagen");
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingProduct = await tx.product.findUnique({
        where: { id: product.id },
      });

      if (!existingProduct) {
        throw new Error("Producto no encontrado");
      }

      const updated = await tx.product.update({
        where: { id: product.id },
        data: {
          name: product.name,
          description: product.description,
          imageUrl: newImageUrl ?? existingProduct.imageUrl,
          stock: product.stock,
          supplierPrice: product.supplierPrice,
          salePrice: product.salePrice,
          colorId: product.color.id,
          sizeId: product.size.id,
          collectionId: product.collection.id,
        },
        include: {
          color: true,
          size: true,
          collection: true,
        },
      });

      return {
        updated,
        oldImageUrl: existingProduct.imageUrl,
      };
    });

    if (product.imageChanged && result.oldImageUrl && newImageUrl) {
      await deleteImage(result.oldImageUrl);
    }

    revalidatePath("/");

    return {
      ok: true,
      product: {
        ...result.updated,
        supplierPrice: Number(result.updated.supplierPrice.toFixed(2)),
        salePrice: Number(result.updated.salePrice.toFixed(2)),
      },
    };
  } catch (e) {
    if (newImageUrl) {
      await deleteImage(newImageUrl);
    }
    console.error(e);
    return {
      ok: false,
      message: "No se pudo actualizar el producto",
    };
  }
};

const deleteImage = async (url: string) => {
  try {
    // https://res.cloudinary.com/dqolgpvsn/image/upload/v1770229758/zueaszzrnzjwororyuue.jpg
    // Las URLs de Cloudinary tienen el formato: https://res.cloudinary.com/cloud_name/image/upload/v123456789/public_id.jpg
    const regex = /\/upload\/(?:v\d+\/)?(.+?)(?:\.[^./]+)?$/;
    const match = url.match(regex);

    if (!match || match.length < 2) {
      console.warn("No se pudo extraer public_id de la URL:", url);
      return;
    }

    const publicId = match[1];
    console.log("Public ID extraído:", publicId);

    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });

    if (result.result !== "ok" && result.result !== "not found") {
      console.warn("Resultado inesperado al eliminar imagen:", result);
    }

    console.log(
      `Imagen ${publicId} eliminada de Cloudinary, resultado:`,
      result,
    );
  } catch (e) {
    console.error("Error eliminando imagen:", e);
    throw e;
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
