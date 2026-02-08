"use server";

import prisma from "@/lib/prisma";

export const getSizes = async () => {
  try {
    const sizes = prisma.size.findMany({
      orderBy: {
        label: "asc",
      },
    });

    return sizes;
  } catch (error) {
    console.log(error);
    return [];
  }
};
