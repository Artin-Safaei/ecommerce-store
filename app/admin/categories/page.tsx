"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FolderPlus,
  LoaderCircle,
  Package,
  RefreshCw,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  createdAt: string;
  _count: {
    products: number;
  };
};

type CategoryForm = {
  name: string;
  slug: string;
  description: string;
  image: string;
};

const emptyForm: CategoryForm = {
  name: "",
  slug: "",
  description: "",
  image: "",
};

const inputClass =
  "mt-2 w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/40";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [editForm, setEditForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
  });

  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/categories", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load categories.");
      }

      if (!Array.isArray(data.categories)) {
        throw new Error("Unexpected categories API response.");
      }

      setCategories(data.categories);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading categories.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  function updateField<K extends keyof CategoryForm>(
    field: K,
    value: CategoryForm[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleNameChange(value: string) {
    setForm((current) => {
      const oldGeneratedSlug = current.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const newGeneratedSlug = value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      return {
        ...current,
        name: value,
        slug:
          !current.slug || current.slug === oldGeneratedSlug
            ? newGeneratedSlug
            : current.slug,
      };
    });
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const name = form.name.trim();
    const slug = form.slug.trim().toLowerCase();

    if (!name || !slug) {
      setError("Category name and slug are required.");
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setError("Use lowercase letters, numbers, and hyphens in the slug.");
      return;
    }

    setCreating(true);

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          slug,
          description: form.description.trim(),
          image: form.image.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create category.");
      }

      setForm(emptyForm);
      setSuccess("Category created successfully.");
      await loadCategories();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating the category.",
      );
    } finally {
      setCreating(false);
    }
  }
  function startEditing(category: Category) {
    setEditingId(category.id);

    setEditForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      image: category.image ?? "",
    });

    setActionError("");
    setActionSuccess("");
  }

  async function saveCategory() {
    if (!editingId || savingEdit) return;

    setSavingEdit(true);
    setActionError("");
    setActionSuccess("");

    try {
      const response = await fetch(`/api/admin/categories/${editingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update category.");
      }

      setEditingId(null);
      setActionSuccess("Category updated successfully.");

      await loadCategories();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setSavingEdit(false);
    }
  }

  async function deleteCategory(category: Category) {
    const confirmed = window.confirm(
      `Delete "${category.name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setActionError("");
    setActionSuccess("");

    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete category.");
      }

      setActionSuccess("Category deleted successfully.");

      await loadCategories();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    }
  }
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin/products"
          className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to products
        </Link>

        <header className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-zinc-500">
              Store management
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Categories
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Organize the products in your Cataphract Style store.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadCategories()}
            disabled={loading}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/5 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0 rounded-2xl border border-white/10 bg-zinc-900/30">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-6">
              <div>
                <h2 className="font-medium">All categories</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  {categories.length} categories
                </p>
              </div>

              <div className="grid grid-cols-2">
                <Package size={19} className="text-zinc-500" />
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="m-5 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
              >
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center gap-3 p-12 text-sm text-zinc-400">
                <LoaderCircle size={20} className="animate-spin" />
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <div className="p-12 text-center">
                <FolderPlus size={28} className="mx-auto mb-4 text-zinc-500" />
                <p className="font-medium">No categories yet</p>
                <p className="mt-2 text-sm text-zinc-500">
                  Create your first category using the form.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {categories.map((category) => (
                  <article
                    key={category.id}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <div className="min-w-0">
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="mt-1 break-all text-xs text-zinc-500">
                        /categories/{category.slug}
                      </p>

                      {category.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                          {category.description}
                        </p>
                      )}
                    </div>

                    <div className="flex w-fit shrink-0 items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-300">
                      <Package size={14} className="text-zinc-500" />
                      {category._count.products} products
                      <div className="flex items-center gap-3 ml-3">
                        <button
                          type="button"
                          onClick={() => startEditing(category)}
                          className="text-sm text-zinc-300 transition hover:text-white"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteCategory(category)}
                          className="text-sm text-red-400 transition hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="h-fit rounded-2xl border border-white/10 bg-zinc-900/30 p-5 sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                <FolderPlus size={19} />
              </div>

              <div>
                <h2 className="font-medium">New category</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Add a store category
                </p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label htmlFor="name" className="text-sm text-zinc-300">
                  Category name *
                </label>

                <input
                  id="name"
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  placeholder="Accessories"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="slug" className="text-sm text-zinc-300">
                  URL slug *
                </label>

                <input
                  id="slug"
                  required
                  maxLength={120}
                  pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  value={form.slug}
                  onChange={(event) => updateField("slug", event.target.value)}
                  placeholder="accessories"
                  className={inputClass}
                />
                <p className="mt-2 text-xs text-zinc-500">
                  Used in the category URL.
                </p>
              </div>

              <div>
                <label htmlFor="description" className="text-sm text-zinc-300">
                  Description
                </label>

                <textarea
                  id="description"
                  rows={3}
                  maxLength={1000}
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Describe this category..."
                  className={`${inputClass} resize-y`}
                />
              </div>

              <div>
                <label htmlFor="image" className="text-sm text-zinc-300">
                  Image path or URL
                </label>

                <input
                  id="image"
                  maxLength={2048}
                  value={form.image}
                  onChange={(event) => updateField("image", event.target.value)}
                  placeholder="/images/categories/accessories.jpg"
                  className={inputClass}
                />
              </div>

              {success && (
                <p
                  role="status"
                  className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-300"
                >
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={creating}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creating ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <FolderPlus size={17} />
                )}
                {creating ? "Creating..." : "Create category"}
              </button>
            </form>
          </aside>
        </div>
      </div>
    </main>
  );
}
