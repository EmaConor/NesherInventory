"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import { requireSession } from "@/lib/require-session";
cloudinary.config(process.env.CLOUDINARY_URL ?? "");

export const deleteProduct = async (id: string) => {
  try {
    await requireSession();
    
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) return { ok: false, message: "Producto no encontrado" };

    if (product.imageUrl) {
      try {
        await deleteImage(product.imageUrl);
      } catch (e) {
        console.error("Error eliminando imagen de Cloudinary:", e);
      }
    }

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/");

    return {
      ok: true,
      message: "Eliminado correctamente",
    };
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return { ok: false, message: "No autorizado" };
    }
    console.error(error);
    return {
      ok: false,
      message: "No se pudo eliminar el product",
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

    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });

    if (result.result !== "ok" && result.result !== "not found") {
      console.warn("Resultado inesperado al eliminar imagen:", result);
    }
  } catch (e) {
    console.error("Error eliminando imagen:", e);
    throw e;
  }
};
