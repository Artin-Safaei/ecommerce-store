import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="mx-auto flex min-h-[650px] max-w-7xl items-center px-6 py-24">
        <div className="max-w-3xl">
          <p className="mb-6 text-sm font-medium uppercase tracking-[0.35em] text-blue-500">
            Premium Products
          </p>

          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
            Everything you need.
            <span className="block text-zinc-500">
              In one place.
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-400">
            Discover premium products carefully selected for quality,
            performance and modern living.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="group flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              Shop Now

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/categories"
              className="rounded-full border border-zinc-700 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-zinc-500"
            >
              Explore Categories
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}