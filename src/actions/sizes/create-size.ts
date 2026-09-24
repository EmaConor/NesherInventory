"use server";

import { InputSize } from "@/interfaces";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/require-session";
import { revalidatePath } from "next/cache";

export const createSize = async (size: InputSize) => {
  try {
    await requireSession();

    const sizeSaved = await prisma.size.create({
      data: size,
    });

    revalidatePath("/");

    return {
      ok: true,
      message: "Talla creada exitosamente",
      size: sizeSaved,
    };
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return { ok: false, message: "No autorizado" };
    }
    console.error(e);
    return {
      ok: false,
      message: '"No se pudo grabar la talla',
    };
  }
};
