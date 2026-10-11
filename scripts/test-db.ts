import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const categories = await prisma.category.findMany();
  const products = await prisma.product.findMany();

  console.log("Categories:", categories.length);
  console.log("Products:", products.length);

  console.log("\nCategory data:");
  console.log(categories);

  console.log("\nProduct data:");
  console.log(products);
}

main()
  .catch((error) => {
    console.error("Database test failed:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });