"use server";

import { InputCollection } from "@/interfaces";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/require-session";
import { revalidatePath } from "next/cache";

export const createCollection = async (collection: InputCollection) => {
  try {
    await requireSession();

    const collectionSaved = await prisma.collection.create({
      data: collection,
    });

    revalidatePath("/");

    return {
      ok: true,
      message: "Categoría creada exitosamente",
      collection: collectionSaved,
    };
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return { ok: false, message: "No autorizado" };
    }
    console.error(e)
    return {
      ok: false,
      message: '"No se pudo grabar la categoría',
    };
  }
};
