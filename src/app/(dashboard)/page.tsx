import { getCollections, getColors, getSizes } from "@/actions";
import { Header, Hero } from "@/components";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    color?: string;
    size?: string;
    category?: string;
    stock?: string;
  }>;
}) {
  const params = await searchParams;

  const sizes = await getSizes();
  const colors = await getColors();
  const collections = await getCollections();
  return (
    <div className="min-h-screen">
      <Header colors={colors} sizes={sizes} collections={collections} />

      <Hero
        colors={colors}
        sizes={sizes}
        collections={collections}
        searchParams={params}
      />
    </div>
  );
}
