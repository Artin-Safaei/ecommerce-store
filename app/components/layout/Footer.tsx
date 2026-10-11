export default function Footer() {
  return (
    <footer className="border-t border-zinc-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © 2026 Store. All rights reserved.
        </p>

        <div className="flex gap-6">
          <a href="#" className="transition hover:text-white">
            Privacy
          </a>

          <a href="#" className="transition hover:text-white">
            Terms
          </a>

          <a href="#" className="transition hover:text-white">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}