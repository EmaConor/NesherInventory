"use server";
import { EmptyState, ProductFilters, ProductGrid, Stats } from "@/components";

import { getProducts, getStats } from "@/actions";
import { Color, Size, Collection } from "@/interfaces";

export const Hero = async ({
  colors,
  sizes,
  collections,
  searchParams,
}: {
  colors: Color[];
  sizes: Size[];
  collections: Collection[];
  searchParams: {
    search?: string;
    color?: string;
    size?: string;
    category?: string;
    stock?: string;
  };
}) => {
  const result = await getStats();

  if (!result.ok || !result.stats) {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-3xl text-foreground">Dashboard</h1>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-800">
          <p>Error cargando estadísticas</p>
          <p className="text-sm mt-2">{result.message}</p>
        </div>
      </div>
    );
  }

  const { products } = await getProducts({
    search: searchParams.search,
    colorId: searchParams.color,
    sizeId: searchParams.size,
    collectionId: searchParams.category,
    stockStatus: searchParams.stock,
  });

  const hasActiveFilters = Boolean(
    searchParams.search ||
    searchParams.color ||
    searchParams.size ||
    searchParams.category ||
    searchParams.stock,
  );

  const { stats } = result;
  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      <Stats stats={stats} />

      <ProductFilters colors={colors} sizes={sizes} collections={collections} />

      {products.length === 0 ? (
        <EmptyState
          hasFilters={hasActiveFilters}
          colors={colors}
          sizes={sizes}
          collections={collections}
        />
      ) : (
        <ProductGrid
          products={products}
          colors={colors}
          sizes={sizes}
          collections={collections}
        />
      )}
    </main>
  );
};
