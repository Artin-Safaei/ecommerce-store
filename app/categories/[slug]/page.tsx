import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

type CategoryProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  featured: boolean;
  stock: number;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  products: CategoryProduct[];
};

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getCategory(slug: string): Promise<Category> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/categories/${slug}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Category not found");
  }

  return response.json();
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;

  let category: Category | null = null;

  try {
    category = await getCategory(slug);
  } catch (error) {
    console.error("Failed to load category:", error);
  }

  if (!category) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold">
            Category not found
          </h1>

          <Link
            href="/categories"
            className="mt-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to categories
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          All categories
        </Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-blue-500">
              Category
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              {category.name}
            </h1>

            <p className="mt-5 max-w-xl leading-8 text-zinc-500">
              {category.description ??
                `Explore our ${category.name.toLowerCase()} products.`}
            </p>

            <p className="mt-6 text-sm text-zinc-600">
              {category.products.length}{" "}
              {category.products.length === 1
                ? "product"
                : "products"}
            </p>
          </div>

          {category.image && (
            <div className="relative aspect-[16/7] overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
              <Image
                src={category.image}
                alt={category.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>
          )}
        </div>

        {category.products.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-12 text-center">
            <h2 className="text-xl font-semibold">
              No products in this category
            </h2>

            <p className="mt-3 text-sm text-zinc-500">
              Check back later for new products.
            </p>
          </div>
        ) : (
          <div className="mt-16">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
              <h2 className="text-xl font-semibold">
                Products
              </h2>

              <p className="text-sm text-zinc-500">
                {category.products.length} items
              </p>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {category.products.map((product) => (
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
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </div>

                    <div className="p-5">
                      <h3 className="font-medium text-white">
                        {product.name}
                      </h3>

                      <p className="mt-3 text-sm font-semibold">
                        ${product.price.toFixed(2)}
                      </p>

                      <div className="mt-4 flex items-center justify-between text-xs">
                        <span
                          className={
                            product.stock > 0
                              ? "text-zinc-500"
                              : "text-red-400"
                          }
                        >
                          {product.stock > 0
                            ? `${product.stock} available`
                            : "Out of stock"}
                        </span>

                        <span className="flex items-center gap-1 text-zinc-600 transition group-hover:text-white">
                          View
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}