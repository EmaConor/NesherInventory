"use server";

import prisma from "@/lib/prisma";

export const getStats = async () => {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        stock: true,
        supplierPrice: true,
        salePrice: true,
      },
    });

    const totalProducts = products.length;

    const lowStockCount = products.filter(
      (product) => product.stock > 0 && product.stock < 5,
    ).length;

    const outOfStockCount = products.filter(
      (product) => product.stock === 0,
    ).length;

    const totalInventoryValue = products.reduce((total, product) => {
      const supplierPrice = Number(product.supplierPrice);
      return total + (supplierPrice * product.stock);
    }, 0);
    
    const totalPotentialValue = products.reduce((total, product) => {
      const salePrice = Number(product.salePrice);
      return total + (salePrice * product.stock);
    }, 0);

    const totalProfit = totalPotentialValue - totalInventoryValue;
    
    return {
      ok: true,
      stats: {
        totalProducts,
        lowStockCount,
        outOfStockCount,
        totalInventoryValue: Number(totalInventoryValue.toFixed(2)),
        totalPotentialValue: Number(totalPotentialValue.toFixed(2)),
        totalProfit: Number(totalProfit.toFixed(2))
      },
    };
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    return {
      ok: false,
      message: "Error obteniendo estadísticas",
      stats: null,
    };
  }
};
