"use server";

import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

interface FilterParams {
  search?: string;
  colorId?: string;
  sizeId?: string;
  collectionId?: string;
  stockStatus?: string;
}

export const getProducts = async (filters?: FilterParams) => {
  try {
    const where: Prisma.ProductWhereInput = {};

    const search = filters?.search
      ? decodeURIComponent(filters.search.replace(/\+/g, " "))
      : undefined;

    // Filtro de búsqueda
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Filtro por color
    if (filters?.colorId && filters.colorId !== "all") {
      const colorId = Number(filters.colorId);
      if (!Number.isNaN(colorId)) {
        where.colorId = colorId;
      }
    }

    // Size
    if (filters?.sizeId && filters.sizeId !== "all") {
      const sizeId = Number(filters.sizeId);
      if (!Number.isNaN(sizeId)) {
        where.sizeId = sizeId;
      }
    }

    // Collection
    if (filters?.collectionId && filters.collectionId !== "all") {
      const collectionId = Number(filters.collectionId);
      if (!Number.isNaN(collectionId)) {
        where.collectionId = collectionId;
      }
    }

    // Filtro por stock
    if (filters?.stockStatus && filters.stockStatus !== "all") {
      switch (filters.stockStatus) {
        case "in-stock":
          where.stock = { gt: 4 };
          break;
        case "low-stock":
          where.stock = { lte: 4, gt: 0 };
          break;
        case "out-of-stock":
          where.stock = 0;
          break;
      }
    }

    const prismaProducts = await prisma.product.findMany({
      where,
      include: {
        collection: true,
        color: true,
        size: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      ok: true,
      products: prismaProducts.map((p) => ({
        ...p,
        supplierPrice: Number(p.supplierPrice.toFixed(2)),
        salePrice: Number(p.salePrice.toFixed(2)),
      })),
      message: "Productos cargados correctamente",
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      products: [],
      message: "No se pudo conseguir los productos",
    };
  }
};
