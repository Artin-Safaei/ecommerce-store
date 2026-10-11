"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

import type { Product } from "@/app/types/product";
import { getProducts } from "@/app/lib/api/products";
import WishlistButton from "../components/WishlistButton";

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-zinc-400">Loading products...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-red-400">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-zinc-500">
            Collection
          </p>

          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Shop
          </h1>

          <p className="mt-4 max-w-2xl text-zinc-400">
            Discover premium products designed for modern everyday life.
          </p>
        </div>

        {/* Product count */}
        <div className="mb-8 flex items-center justify-between border-b border-zinc-800 pb-5">
          <p className="text-sm text-zinc-500">{products.length} products</p>
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-900">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute right-3 top-3">
                  <WishlistButton productId={product.id} size="sm" />
                </div>
                {product.featured && (
                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-medium text-black">
                    Featured
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="mt-4">
                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  {product.category.name}
                </p>

                <div className="mt-2 flex items-start justify-between gap-4">
                  <h2 className="font-medium text-zinc-100 transition group-hover:text-white">
                    {product.name}
                  </h2>

                  <span className="shrink-0 text-sm text-zinc-300">
                    ${product.price}
                  </span>
                </div>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-500">
                  {product.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
