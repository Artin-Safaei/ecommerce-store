"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import type { Product } from "@/app/types/product";
import { useCartStore } from "@/app/store/cart-store";
import WishlistButton from "@/app/components/WishlistButton";

export default function ProductDetails() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(`/api/products/${productId}`);

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data: Product = await response.json();

        setProduct(data);
      } catch (error) {
        console.error("Failed to load product:", error);
        setError("Product could not be loaded.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-zinc-400">Loading product...</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-red-400">{error ?? "Product not found."}</p>

          <Link
            href="/shop"
            className="mt-6 inline-block text-sm text-zinc-300 underline"
          >
            Back to shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        {/* Product image */}
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-zinc-900">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Product information */}
        <div className="flex flex-col justify-center">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
            {product.category.name}
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            {product.name}
          </h1>

          <p className="mt-6 text-2xl text-zinc-200">${product.price}</p>

          <p className="mt-6 max-w-xl leading-8 text-zinc-400">
            {product.description}
          </p>

          <p className="mt-6 text-sm text-zinc-500">
            {product.stock > 0
              ? `${product.stock} items available`
              : "Out of stock"}
          </p>

          <button
            type="button"
            disabled={product.stock === 0}
            onClick={() => addItem(product)}
            className="mt-8 w-full rounded-xl bg-white px-6 py-4 font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {product.stock > 0 ? "Add to cart" : "Out of stock"}
          </button>


          <Link
            href="/shop"
            className="mt-4 text-center text-sm text-zinc-500 transition hover:text-white"
          >
            ← Back to shop
          </Link>
                    <WishlistButton productId={product.id} />

        </div>
      </div>
    </main>
  );
}
