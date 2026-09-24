"use server";

import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/require-session";

export const getCollections = async () => {
  try {
    await requireSession();

    const collections = await prisma.collection.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return collections;
  } catch (error) {
    console.error(error);
    return [];
  }
};
