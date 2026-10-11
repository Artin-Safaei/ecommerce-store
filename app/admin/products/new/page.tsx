
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LoaderCircle, PackagePlus } from "lucide-react";

type Category = {
  id: string;
  name: string;
};

type ProductForm = {
  name: string;
  slug: string;
  description: string;
  price: string;
  image: string;
  categoryId: string;
  stock: string;
  featured: boolean;
};

const initialForm: ProductForm = {
  name: "",
  slug: "",
  description: "",
  price: "",
  image: "",
  categoryId: "",
  stock: "0",
  featured: false,
};

export default function NewProductPage() {
  const router = useRouter();

  const [form, setForm] = useState<ProductForm>(initialForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load categories.");
        }

        // Supports either an array or { categories: [...] }.
        const result: Category[] = Array.isArray(data)
          ? data
          : data.categories;

        if (!Array.isArray(result)) {
          throw new Error("Unexpected categories API response.");
        }

        setCategories(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load categories."
        );
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  function updateField<K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim() || !form.slug.trim()) {
      setError("Product name and slug are required.");
      return;
    }

    if (!form.categoryId) {
      setError("Please select a category.");
      return;
    }

    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!Number.isFinite(price) || price < 0) {
      setError("Price must be a valid non-negative number.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setError("Stock must be a non-negative whole number.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          slug: form.slug.trim(),
          description: form.description.trim(),
          price,
          image: form.image.trim(),
          categoryId: form.categoryId,
          stock,
          featured: form.featured,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create product.");
      }

      setSuccess("Product created successfully.");

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating the product."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/40";

  const labelClass = "text-sm font-medium text-zinc-300";

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin/products"
          className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to products
        </Link>

        <div className="mb-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <PackagePlus size={22} />
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">
            Create product
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Add a product to your store catalog.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-white/10 bg-zinc-900/40 p-5 sm:p-8"
        >
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300"
            >
              {success}
            </div>
          )}

          <div>
            <label htmlFor="name" className={labelClass}>
              Product name *
            </label>
            <input
              id="name"
              required
              maxLength={120}
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Wireless Headphones"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="slug" className={labelClass}>
              URL slug *
            </label>
            <input
              id="slug"
              required
              maxLength={150}
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              title="Use lowercase letters, numbers, and hyphens."
              value={form.slug}
              onChange={(e) =>
                updateField(
                  "slug",
                  e.target.value
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "")
                    .replace(/-+/g, "-")
                )
              }
              placeholder="wireless-headphones"
              className={inputClass}
            />
            <p className="mt-2 text-xs text-zinc-500">
              Use lowercase letters, numbers, and hyphens.
            </p>
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>
              Description *
            </label>
            <textarea
              id="description"
              required
              rows={5}
              maxLength={5000}
              value={form.description}
              onChange={(e) =>
                updateField("description", e.target.value)
              }
              placeholder="Describe the product and its main features..."
              className={`${inputClass} resize-y`}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="price" className={labelClass}>
                Price *
              </label>
              <input
                id="price"
                type="number"
                required
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                placeholder="99.99"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="stock" className={labelClass}>
                Stock quantity *
              </label>
              <input
                id="stock"
                type="number"
                required
                min="0"
                step="1"
                value={form.stock}
                onChange={(e) => updateField("stock", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="image" className={labelClass}>
              Image path or URL *
            </label>
            <input
              id="image"
              type="text"
              required
              maxLength={2048}
              value={form.image}
              onChange={(e) => updateField("image", e.target.value)}
              placeholder="/products/headphones.jpg"
              className={inputClass}
            />
            <p className="mt-2 text-xs text-zinc-500">
              For local images, place the file inside the public directory
              and enter its path, such as /products/headphones.jpg.
            </p>
          </div>

          <div>
            <label htmlFor="categoryId" className={labelClass}>
              Category *
            </label>
            <select
              id="categoryId"
              required
              value={form.categoryId}
              onChange={(e) =>
                updateField("categoryId", e.target.value)
              }
              disabled={loadingCategories || categories.length === 0}
              className={inputClass}
            >
              <option value="">
                {loadingCategories
                  ? "Loading categories..."
                  : categories.length === 0
                    ? "No categories available"
                    : "Select a category"}
              </option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 p-4">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) =>
                updateField("featured", e.target.checked)
              }
              className="mt-1 h-4 w-4 accent-white"
            />

            <span>
              <span className="block text-sm font-medium">
                Featured product
              </span>
              <span className="mt-1 block text-xs text-zinc-500">
                Mark this product for featured sections in your store.
              </span>
            </span>
          </label>

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/admin/products"
              className="rounded-lg border border-white/10 px-5 py-3 text-center text-sm font-medium text-zinc-300 transition hover:bg-white/5"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting || loadingCategories || categories.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && (
                <LoaderCircle size={16} className="animate-spin" />
              )}
              {submitting ? "Creating product..." : "Create product"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
