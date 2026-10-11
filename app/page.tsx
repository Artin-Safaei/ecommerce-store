
import Hero from "./components/home/Hero";
import Categories from "./components/home/Categories";
import FeaturedProducts from "./components/home/FeaturedProducts";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      <main>
        <Hero />
        <Categories />
        <FeaturedProducts />
      </main>

    </div>
  );
}