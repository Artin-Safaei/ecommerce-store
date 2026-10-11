
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LoaderCircle, Save } from "lucide-react";

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  featured: boolean;
  categoryId: string;
  category?: Category;
};

type ProductForm = {
  name: string;
  slug: string;
  description: string;
  price: string;
  image: string;
  stock: string;
  categoryId: string;
  featured: boolean;
};

const inputClass =
  "mt-2 w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/40";

const labelClass = "text-sm font-medium text-zinc-300";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = params.id;

  const [form, setForm] = useState<ProductForm>({
    name: "",
    slug: "",
    description: "",
    price: "",
    image: "",
    stock: "0",
    categoryId: "",
    featured: false,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/categories"),
        ]);

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();

        if (!productsResponse.ok) {
          throw new Error(
            productsData.message || "Failed to load products."
          );
        }

        if (!categoriesResponse.ok) {
          throw new Error(
            categoriesData.message || "Failed to load categories."
          );
        }

        const products: Product[] = Array.isArray(productsData)
          ? productsData
          : productsData.products;

        const loadedCategories: Category[] = Array.isArray(categoriesData)
          ? categoriesData
          : categoriesData.categories;

        if (!Array.isArray(products) || !Array.isArray(loadedCategories)) {
          throw new Error("The API returned an unexpected response.");
        }

        const product = products.find((item) => item.id === productId);

        if (!product) {
          throw new Error("Product not found.");
        }

        if (!cancelled) {
          setCategories(loadedCategories);
          setForm({
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: String(product.price),
            image: product.image,
            stock: String(product.stock),
            categoryId: product.categoryId,
            featured: product.featured,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load product."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (productId) {
      loadData();
    }

    return () => {
      cancelled = true;
    };
  }, [productId]);

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

    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!form.name.trim() || !form.slug.trim() || !form.description.trim()) {
      setError("Name, slug, and description are required.");
      return;
    }

    if (!form.categoryId) {
      setError("Please select a category.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError("Price must be a valid non-negative number.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setError("Stock must be a non-negative whole number.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          slug: form.slug.trim(),
          description: form.description.trim(),
          price,
          image: form.image.trim(),
          stock,
          categoryId: form.categoryId,
          featured: form.featured,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update product.");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while updating the product."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        <LoaderCircle size={24} className="mr-3 animate-spin" />
        Loading product...
      </main>
    );
  }

  if (error && !form.name) {
    return (
      <main className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
        <div className="mx-auto max-w-xl rounded-2xl border border-white/10 p-6">
          <p role="alert" className="text-red-300">
            {error}
          </p>
          <Link
            href="/admin/products"
            className="mt-5 inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to products
          </Link>
        </div>
      </main>
    );
  }

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
          <h1 className="text-3xl font-semibold tracking-tight">
            Edit product
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Update product details, pricing, inventory, and visibility.
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
              className={inputClass}
            />
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
              required
              maxLength={2048}
              value={form.image}
              onChange={(e) => updateField("image", e.target.value)}
              className={inputClass}
            />
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
              className={inputClass}
            >
              <option value="">Select a category</option>
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
                Show this product in featured sections.
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
              disabled={saving || categories.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {saving ? "Saving changes..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
