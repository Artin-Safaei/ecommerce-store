"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  stock: number;
  featured: boolean;
  category: { name: string };
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/products");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load products.");
      }

      setProducts(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  async function updateProduct(
    id: string,
    changes: Partial<Pick<Product, "price" | "stock" | "featured">>,
  ) {
    try {
      setBusyId(id);
      setError("");
      setNotice("");

      const response = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update product.");
      }

      setProducts((current) =>
        current.map((product) => (product.id === id ? data : product)),
      );

      setNotice(`${data.name} updated successfully.`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setBusyId("");
    }
  }

  async function deleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setBusyId(product.id);
      setError("");
      setNotice("");

      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete product.");
      }

      setProducts((current) =>
        current.filter((item) => item.id !== product.id),
      );

      setNotice(data.message);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="text-sm text-zinc-500 hover:text-white">
          ← Back to dashboard
        </Link>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-blue-500">
              Inventory
            </p>
            <h1 className="mt-3 text-4xl font-bold">Products</h1>
            <p className="mt-2 text-zinc-500">
              Manage product prices, availability and featured items.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadProducts}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 px-4 py-3 text-sm hover:bg-zinc-900"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>

            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-zinc-200"
            >
              <Plus className="h-4 w-4" />
              Add product
            </Link>
          </div>
        </div>

        {error && (
          <p className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </p>
        )}

        {notice && (
          <p className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400">
            {notice}
          </p>
        )}

        <div className="mt-8 overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-zinc-900 text-zinc-400">
              <tr>
                <th className="px-5 py-4 font-medium">Product</th>
                <th className="px-5 py-4 font-medium">Category</th>
                <th className="px-5 py-4 font-medium">Price ($)</th>
                <th className="px-5 py-4 font-medium">Stock</th>
                <th className="px-5 py-4 font-medium">Featured</th>
                <th className="px-5 py-4 font-medium">Delete</th>
                <th className="px-5 py-4 font-medium">Edit</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-zinc-500" />
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-16 text-center text-zinc-500"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-900/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg bg-zinc-900 object-cover"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="mt-1 text-xs text-zinc-600">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-zinc-400">
                      {product.category.name}
                    </td>

                    <td className="px-5 py-4">
                      <input
                        aria-label={`Price for ${product.name}`}
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={product.price}
                        key={`${product.id}-price-${product.price}`}
                        onBlur={(event) => {
                          const value = Number(event.target.value);
                          if (
                            Number.isFinite(value) &&
                            value >= 0 &&
                            value !== product.price
                          ) {
                            void updateProduct(product.id, { price: value });
                          }
                        }}
                        className="w-24 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 outline-none focus:border-blue-500"
                      />
                    </td>

                    <td className="px-5 py-4">
                      <input
                        aria-label={`Stock for ${product.name}`}
                        type="number"
                        min="0"
                        step="1"
                        defaultValue={product.stock}
                        key={`${product.id}-stock-${product.stock}`}
                        onBlur={(event) => {
                          const value = Number(event.target.value);
                          if (
                            Number.isInteger(value) &&
                            value >= 0 &&
                            value !== product.stock
                          ) {
                            void updateProduct(product.id, { stock: value });
                          }
                        }}
                        className="w-24 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 outline-none focus:border-blue-500"
                      />
                    </td>

                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        aria-label={`Featured ${product.name}`}
                        checked={product.featured}
                        disabled={busyId === product.id}
                        onChange={(event) =>
                          updateProduct(product.id, {
                            featured: event.target.checked,
                          })
                        }
                        className="h-4 w-4 accent-blue-500"
                      />
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => deleteProduct(product)}
                        disabled={busyId === product.id}
                        aria-label={`Delete ${product.name}`}
                        className="rounded-lg p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                      >
                        {busyId === product.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-sm text-zinc-300 transition hover:text-white"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-zinc-600">
          Price and stock changes are saved when you leave the input field.
        </p>
      </div>
    </main>
  );
}
