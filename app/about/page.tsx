
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  MoveUpRight,
} from "lucide-react";

const principles = [
  {
    number: "01",
    title: "Intentional design",
    description:
      "We believe great style starts with thoughtful choices, clean silhouettes, and details that make a difference.",
  },
  {
    number: "02",
    title: "Everyday versatility",
    description:
      "Pieces should work together effortlessly, giving you the freedom to create a look that feels distinctly yours.",
  },
  {
    number: "03",
    title: "Confidence in simplicity",
    description:
      "Less noise. More character. We focus on timeless aesthetics that let your individuality take the lead.",
  },
];

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-[#090909] text-white">
      {/* Hero */}
      <section className="relative flex min-h-[680px] items-end border-b border-white/10 sm:min-h-[760px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/About/Aditional-hero-Banner-AboutPage.jpg')",
          }}
        />

        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-black/20 to-black/10" />

        <div className="relative mx-auto w-full max-w-7xl px-5 pb-14 pt-36 sm:px-8 sm:pb-20 lg:px-12">
          <div className="mb-8 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/70">
            <span className="h-px w-8 bg-white/70" />
            The Cataphract story
          </div>

          <h1 className="max-w-5xl text-5xl font-medium uppercase leading-[0.95] tracking-[-0.055em] sm:text-7xl lg:text-8xl xl:text-[112px]">
            Style is
            <br />
            more than
            <br />
            <span className="text-white/55">what you wear.</span>
          </h1>

          <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-md text-sm leading-7 text-white/75 sm:text-base">
              Cataphract Style is built around individuality,
              considered design, and the confidence to define
              your own identity.
            </p>

            <Link
              href="/shop"
              className="group inline-flex w-fit items-center gap-3 border-b border-white/50 pb-3 text-xs font-medium uppercase tracking-[0.2em] transition hover:border-white"
            >
              Explore the collection
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        <div className="absolute right-6 top-32 hidden items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-white/60 lg:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          Independent by design
        </div>
      </section>

      {/* Brand story */}
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-2 lg:gap-24 lg:px-12">
      
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/45">
            01 / Who we are
          </p>

          <h2 className="mt-8 max-w-xl text-4xl font-medium leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            Built on character.
            <span className="text-white/40">
              {" "}Defined by style.
            </span>
          </h2>
        </div>

        <div className="flex flex-col justify-center gap-6">
          <p className="text-base leading-8 text-white/75 sm:text-lg">
            We believe personal style is a language of its own.
            It tells a story before you say a word and reflects
            the choices that make you who you are.
          </p>

          <p className="text-sm leading-7 text-white/50">
            Cataphract Style brings together fashion and lifestyle
            through a modern, understated perspective. Our vision
            is simple: create a space for pieces that feel
            considered, versatile, and personal.
          </p>

          <div className="mt-4 flex items-center gap-4 border-t border-white/10 pt-6">
            <span className="text-xs uppercase tracking-[0.25em] text-white/40">
              Our perspective
            </span>
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xs uppercase tracking-[0.2em]">
              Less, but better.
            </span>
          </div>
        </div>
      </section>

      {/* Visual statement */}
      <section className="relative mx-5 min-h-[420px] overflow-hidden sm:mx-8 sm:min-h-[540px] lg:mx-12">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/About/Elegant-Fashion.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/15 to-transparent" />

        <div className="relative flex min-h-[420px] max-w-7xl flex-col justify-center px-6 py-16 sm:min-h-[540px] sm:px-12 lg:px-16">
          <p className="text-xs uppercase tracking-[0.3em] text-white/65">
            A different point of view
          </p>

          <h2 className="mt-6 max-w-3xl text-4xl font-medium leading-tight tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            Don&apos;t follow
            <br />
            a uniform.
            <br />
            <span className="text-white/55">Define your own.</span>
          </h2>

          <div className="mt-8 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-white/70">
            <ArrowDown size={15} />
            Find your expression
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">
              02 / What matters
            </p>

            <h2 className="mt-6 text-4xl font-medium tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              The principles
              <br />
              <span className="text-white/40">behind the style.</span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-7 text-white/50">
            Every detail starts with a simple idea: personal style
            should feel natural, considered, and entirely your own.
          </p>
        </div>

        <div className="mt-16 grid border-t border-white/15 md:grid-cols-3">
          {principles.map((principle) => (
            <article
              key={principle.number}
              className="group border-b border-white/15 py-8 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs tracking-[0.2em] text-white/40">
                  {principle.number}
                </span>

                <MoveUpRight
                  size={18}
                  className="text-white/35 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white"
                />
              </div>

              <h3 className="mt-12 text-xl font-medium tracking-tight sm:text-2xl">
                {principle.title}
              </h3>

              <p className="mt-4 max-w-sm text-sm leading-7 text-white/50">
                {principle.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Final call to action */}
      <section className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-20 sm:px-8 sm:py-28 lg:flex-row lg:items-end lg:justify-between lg:px-12">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">
              Make it yours
            </p>

            <h2 className="mt-6 max-w-3xl text-4xl font-medium leading-tight tracking-[-0.045em] sm:text-6xl">
              Your style.
              <br />
              <span className="text-white/40">Your statement.</span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/50">
              Explore pieces that fit your perspective and
              make everyday dressing your own.
            </p>
          </div>

          <Link
            href="/shop"
            className="group inline-flex w-fit items-center gap-4 border border-white/20 px-6 py-4 text-xs font-medium uppercase tracking-[0.2em] transition hover:border-white hover:bg-white hover:text-black"
          >
            Discover the collection
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>
    </main>
  );
}
