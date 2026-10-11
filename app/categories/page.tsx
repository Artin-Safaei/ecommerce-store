import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  _count: {
    products: number;
  };
};

async function getCategories(): Promise<Category[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/categories`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
}

export default async function CategoriesPage() {
  let categories: Category[] = [];

  try {
    categories = await getCategories();
  } catch (error) {
    console.error("Failed to load categories:", error);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-blue-500">
            Categories
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Explore our categories
          </h1>

          <p className="mt-5 max-w-2xl leading-7 text-zinc-500">
            Browse our products by category and find the right products for
            your needs.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-12 text-center">
            <h2 className="text-xl font-semibold">
              No categories found
            </h2>

            <p className="mt-3 text-sm text-zinc-500">
              Categories are currently unavailable.
            </p>
          </div>
        ) : (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group"
              >
                <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50 transition duration-300 hover:-translate-y-1 hover:border-zinc-700">
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-zinc-700">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold">
                          {category.name}
                        </h2>

                        <p className="mt-2 text-sm text-zinc-500">
                          {category.description ??
                            "Explore products in this category."}
                        </p>
                      </div>

                      <ArrowRight
                        size={20}
                        className="mt-1 shrink-0 text-zinc-600 transition duration-300 group-hover:translate-x-1 group-hover:text-white"
                      />
                    </div>

                    <p className="mt-5 text-xs uppercase tracking-wider text-blue-500">
                      {category._count.products}{" "}
                      {category._count.products === 1
                        ? "product"
                        : "products"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
