"use server";

import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/require-session";

export const getSizes = async () => {
  try {
    await requireSession();

    const sizes = prisma.size.findMany({
      orderBy: {
        label: "asc",
      },
    });

    return sizes;
  } catch (error) {
    console.error(error);
    return [];
  }
};
