import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const collections = await Promise.all(
    ["Camisetas", "Pantalones", "Chaquetas"].map((name) =>
      prisma.collection.upsert({
        where: { slug: name.toLowerCase() },
        update: {},
        create: { name, slug: name.toLowerCase() },
      }),
    ),
  );

  const colors = await Promise.all(
    [
      { color: "Negro", hex: "#000000" },
      { color: "Blanco", hex: "#FFFFFF" },
      { color: "Azul", hex: "#1E3A8A" },
    ].map((c) =>
      prisma.color.upsert({
        where: { color: c.color },
        update: {},
        create: c,
      }),
    ),
  );

  const sizes = await Promise.all(
    ["S", "M", "L", "XL"].map((label) =>
      prisma.size.upsert({
        where: { label },
        update: {},
        create: { label },
      }),
    ),
  );

  const sampleProducts = [
    { name: "Camiseta básica", stock: 20, supplierPrice: 15000, salePrice: 35000 },
    { name: "Pantalón cargo", stock: 3, supplierPrice: 40000, salePrice: 90000 },
    { name: "Chaqueta bomber", stock: 0, supplierPrice: 60000, salePrice: 140000 },
  ];

  for (const p of sampleProducts) {
    const slug = p.name.toLowerCase().replace(/\s+/g, "-");
    await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        name: p.name,
        slug,
        stock: p.stock,
        supplierPrice: p.supplierPrice,
        salePrice: p.salePrice,
        collectionId: collections[0].id,
        colorId: colors[0].id,
        sizeId: sizes[0].id,
      },
    });
  }

  console.log("Seed completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
