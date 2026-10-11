import Image from "next/image";
import Link from "next/link";
import { products } from "../../data/products";

export default function FeaturedProducts() {
  const featuredProducts = products.filter(
    (product) => product.featured
  );

  return (
    <section className="border-t border-zinc-900">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm text-zinc-500">
              Our selection
            </p>

            <h2 className="mt-2 text-3xl font-semibold text-white">
              Featured Products
            </h2>
          </div>

          <Link
            href="/shop"
            className="hidden text-sm text-zinc-400 transition hover:text-white sm:block"
          >
            View all →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className="group"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-900">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="mt-5">
                <p className="text-xs uppercase tracking-wider text-zinc-600">
                  {product.category}
                </p>

                <h3 className="mt-2 font-medium text-white">
                  {product.name}
                </h3>

                <p className="mt-2 font-semibold text-white">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}