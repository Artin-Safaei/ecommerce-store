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
  console.log("🌱 Starting database seed...");

  const categories = [
    {
      name: "Audio",
      slug: "audio",
      description: "Premium audio products",
    },
    {
      name: "Wearables",
      slug: "wearables",
      description: "Smart wearable devices",
    },
    {
      name: "Accessories",
      slug: "accessories",
      description: "Everyday premium accessories",
    },
    {
      name: "Workspace",
      slug: "workspace",
      description: "Products for your workspace",
    },
    {
      name: "Lifestyle",
      slug: "lifestyle",
      description: "Products for everyday lifestyle",
    },
    {
      name: "Clothing",
      slug: "clothing",
      description: "Premium everyday clothing",
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
        description: category.description,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
    });
  }

  console.log("✅ Categories created.");

  const products = [
    {
      name: "Minimal Headphones",
      slug: "minimal-headphones",
      categorySlug: "audio",
      price: 129,
      description:
        "Premium wireless headphones designed for immersive sound and everyday comfort.",
      image: "/products/headphones.jpg",
      featured: true,
      stock: 25,
    },
    {
      name: "Smart Watch Pro",
      slug: "smart-watch-pro",
      categorySlug: "wearables",
      price: 249,
      description:
        "A modern smartwatch combining fitness tracking, notifications and a premium design.",
      image: "/products/smart-watch.jpg",
      featured: true,
      stock: 18,
    },
    {
      name: "Premium Backpack",
      slug: "premium-backpack",
      categorySlug: "accessories",
      price: 89,
      description:
        "A minimal everyday backpack designed to carry your essentials comfortably.",
      image: "/products/backpack.jpg",
      featured: true,
      stock: 30,
    },
    {
      name: "Wireless Keyboard",
      slug: "wireless-keyboard",
      categorySlug: "workspace",
      price: 119,
      description:
        "A clean wireless keyboard designed for productive and comfortable workspaces.",
      image: "/products/keyboard.jpg",
      featured: true,
      stock: 20,
    },
    {
      name: "Mechanical Keyboard",
      slug: "mechanical-keyboard",
      categorySlug: "workspace",
      price: 159,
      description:
        "A premium mechanical keyboard built for developers, creators and professionals.",
      image: "/products/mechanical-keyboard.jpg",
      featured: false,
      stock: 15,
    },
    {
      name: "Wireless Mouse",
      slug: "wireless-mouse",
      categorySlug: "workspace",
      price: 79,
      description:
        "A precise and comfortable wireless mouse designed for everyday productivity.",
      image: "/products/mouse.jpg",
      featured: false,
      stock: 35,
    },
    {
      name: "Running Shoes",
      slug: "running-shoes",
      categorySlug: "lifestyle",
      price: 139,
      description:
        "Lightweight running shoes designed for comfort, movement and everyday training.",
      image: "/products/running-shoes.jpg",
      featured: false,
      stock: 22,
    },
    {
      name: "Premium Hoodie",
      slug: "premium-hoodie",
      categorySlug: "clothing",
      price: 99,
      description:
        "A premium everyday hoodie with a clean silhouette and comfortable fit.",
      image: "/products/hoodie.jpg",
      featured: false,
      stock: 28,
    },
  ];

  for (const product of products) {
    const category = await prisma.category.findUnique({
      where: {
        slug: product.categorySlug,
      },
    });

    if (!category) {
      throw new Error(
        `Category not found: ${product.categorySlug}`
      );
    }

    await prisma.product.upsert({
      where: {
        slug: product.slug,
      },

      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        featured: product.featured,
        stock: product.stock,
        categoryId: category.id,
      },

      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        image: product.image,
        featured: product.featured,
        stock: product.stock,
        categoryId: category.id,
      },
    });
  }

  console.log("✅ Products created.");
  console.log("🎉 Database seed completed.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });