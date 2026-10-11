import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";

import type { Product } from "@/app/types/product";
import WishlistButton from "../components/WishlistButton";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;

  const query = params.q?.trim() ?? "";

  let results: Product[] = [];
  let hasError = false;

  if (query) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/products/search?q=${encodeURIComponent(query)}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to search products");
      }

      results = await response.json();
    } catch (error) {
      console.error("Failed to search products:", error);
      hasError = true;
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-blue-500">
            Search
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Search results
          </h1>

          {query ? (
            <p className="mt-4 text-zinc-500">
              Showing results for{" "}
              <span className="text-white">{query}</span>
            </p>
          ) : (
            <p className="mt-4 text-zinc-500">
              Search for products from our store.
            </p>
          )}
        </div>

        {!query ? (
          <div className="mt-16 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-zinc-500">
              <Search size={26} />
            </div>

            <h2 className="mt-6 text-xl font-semibold">
              Start searching
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-zinc-500">
              Use the search bar in the navigation to find products by name,
              category or description.
            </p>

            <Link
              href="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              Browse Shop
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : hasError ? (
          <div className="mt-16 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-red-400">
              <Search size={26} />
            </div>

            <h2 className="mt-6 text-xl font-semibold">
              Something went wrong
            </h2>

            <p className="mt-3 text-sm text-zinc-500">
              We couldn't load the search results.
            </p>

            <Link
              href="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-zinc-700 px-6 py-3 text-sm font-medium text-white transition hover:border-zinc-500"
            >
              View all products
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : results.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-zinc-500">
              <Search size={26} />
            </div>

            <h2 className="mt-6 text-xl font-semibold">
              No products found
            </h2>

            <p className="mt-3 text-sm text-zinc-500">
              We couldn't find anything matching {query}.
            </p>

            <Link
              href="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-zinc-700 px-6 py-3 text-sm font-medium text-white transition hover:border-zinc-500"
            >
              View all products
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-12 flex items-center justify-between border-b border-zinc-800 pb-5">
              <p className="text-sm text-zinc-500">
                {results.length}{" "}
                {results.length === 1 ? "product" : "products"} found
              </p>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group"
                >
                  <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50">
                    <div className="relative aspect-square overflow-hidden bg-zinc-900">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                                <WishlistButton productId={product.id} />

                    </div>

                    <div className="p-5">
                      <p className="text-xs uppercase tracking-wider text-blue-500">
                        {product.category.name}
                      </p>

                      <h2 className="mt-2 font-medium text-white">
                        {product.name}
                      </h2>

                      <p className="mt-3 text-sm font-semibold text-white">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}