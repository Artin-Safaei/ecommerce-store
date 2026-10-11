"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Loader2,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import type { Product } from "@/app/types/product";
import { useCartStore } from "@/app/store/cart-store";

type WishlistItem = {
  id: string;
  product: Product;
};

type Wishlist = {
  id: string | null;
  items: WishlistItem[];
};

export default function WishlistPage() {
  const router = useRouter();

  const addItem = useCartStore(
    (state) => state.addItem
  );

  const [wishlist, setWishlist] = useState<Wishlist>({
    id: null,
    items: [],
  });

  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState("");
  const [addingId, setAddingId] = useState("");
  const [error, setError] = useState("");

  async function fetchWishlist() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/wishlist");

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }

        throw new Error(
          data.message || "Failed to load wishlist."
        );
      }

      setWishlist(data);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load wishlist."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWishlist();
  }, []);

  async function removeFromWishlist(
    productId: string
  ) {
    try {
      setRemovingId(productId);
      setError("");

      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update wishlist."
        );
      }

      setWishlist((current) => ({
        ...current,
        items: current.items.filter(
          (item) => item.product.id !== productId
        ),
      }));
    } catch (error) {
      console.error(
        "Failed to remove wishlist item:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update wishlist."
      );
    } finally {
      setRemovingId("");
    }
  }

  async function handleAddToCart(product: Product) {
    try {
      setAddingId(product.id);

      addItem(product);
    } finally {
      setAddingId("");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-zinc-500" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to account
        </Link>

        <div className="mt-10">
          <p className="text-sm uppercase tracking-[0.25em] text-blue-500">
            Account
          </p>

          <div className="mt-3 flex items-center gap-3">
            <Heart className="h-7 w-7 fill-current text-red-500" />

            <h1 className="text-4xl font-bold tracking-tight">
              Wishlist
            </h1>
          </div>

          <p className="mt-3 text-zinc-500">
            Products you saved for later.
          </p>
        </div>

        {error && (
          <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {wishlist.items.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlist.items.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                removing={removingId === item.product.id}
                adding={addingId === item.product.id}
                onRemove={removeFromWishlist}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function WishlistCard({
  item,
  removing,
  adding,
  onRemove,
  onAddToCart,
}: {
  item: WishlistItem;
  removing: boolean;
  adding: boolean;
  onRemove: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}) {
  const product = item.product;

  return (
    <div className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-zinc-900">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/products/${product.id}`}>
          <p className="text-xs uppercase tracking-wider text-zinc-600">
            {product.category.name}
          </p>

          <h2 className="mt-2 font-semibold transition group-hover:text-blue-400">
            {product.name}
          </h2>
        </Link>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-lg font-semibold">
            ${product.price.toFixed(2)}
          </span>

          <button
            type="button"
            onClick={() => onRemove(product.id)}
            disabled={removing}
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
            aria-label="Remove from wishlist"
          >
            {removing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={() => onAddToCart(product)}
          disabled={adding}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-50"
        >
          {adding ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShoppingCart className="h-4 w-4" />
          )}

          {adding ? "Adding..." : "Add to cart"}
        </button>
      </div>
    </div>
  );
}

function EmptyWishlist() {
  return (
    <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-20 text-center">
      <Heart className="mx-auto h-10 w-10 text-zinc-700" />

      <h2 className="mt-5 text-xl font-semibold">
        Your wishlist is empty
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
        Save products you like and come back to them later.
      </p>

      <Link
        href="/shop"
        className="mt-7 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
      >
        Browse products
      </Link>
    </div>
  );
}