import Link from "next/link";
import {
  Laptop,
  Shirt,
  Headphones,
  Dumbbell,
} from "lucide-react";

const categories = [
  {
    name: "Electronics",
    description: "Modern technology",
    icon: Laptop,
  },
  {
    name: "Clothing",
    description: "Style & fashion",
    icon: Shirt,
  },
  {
    name: "Accessories",
    description: "Complete your setup",
    icon: Headphones,
  },
  {
    name: "Lifestyle",
    description: "For everyday life",
    icon: Dumbbell,
  },
];

export default function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="text-sm text-zinc-500">
            Browse
          </p>

          <h2 className="mt-2 text-3xl font-semibold text-white">
            Featured Categories
          </h2>
        </div>

        <Link
          href="/categories"
          className="hidden text-sm text-zinc-400 transition hover:text-white sm:block"
        >
          View all →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <Link
              href={`/categories/${category.name.toLowerCase()}`}
              key={category.name}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-7 transition duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:bg-zinc-900"
            >
              <div className="mb-14 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-zinc-400 transition group-hover:bg-blue-500/10 group-hover:text-blue-500">
                <Icon size={22} />
              </div>

              <h3 className="text-lg font-medium text-white">
                {category.name}
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                {category.description}
              </p>

              <div className="mt-5 text-sm text-zinc-500 transition group-hover:text-white">
                Explore →
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}