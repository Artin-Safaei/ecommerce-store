"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, ShoppingBag, User, Menu, X, ArrowRight } from "lucide-react";
import { useCartStore } from "../../store/cart-store";

interface NavbarClientProps {
  isAdmin: boolean;
}

const navigation = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Shop",
    href: "/shop",
  },
  {
    name: "Categories",
    href: "/categories",
  },
  {
    name: "About",
    href: "/about",
  },
  

];

export default function NavbarClient({
  isAdmin,
}: NavbarClientProps) {
    console.log("NavbarClient isAdmin:", isAdmin);

  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);
  const items = useCartStore((state) => state.items);

  const cartCount = hydrated
    ? items.reduce((total, item) => total + item.quantity, 0)
    : 0;

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = search.trim();

    if (!query) return;

    setSearchOpen(false);

    router.push(`/search?q=${encodeURIComponent(query)}`);
  };
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6">
        {/* Main Navbar */}
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="shrink-0 text-2xl font-bold tracking-tight text-white"
          >
            Store<span className="text-blue-500">.</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
  {navigation.map((item) => {
    const active = isActive(item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`relative py-2 text-sm transition ${
          active
            ? "text-white"
            : "text-zinc-500 hover:text-white"
        }`}
      >
        {item.name}

        {active && (
          <span className="absolute -bottom-1 left-0 h-px w-full bg-blue-500" />
        )}
      </Link>
    );
  })}

  {isAdmin && (
    <Link
      href="/admin"
      className={`relative py-2 text-sm transition ${
        isActive("/admin")
          ? "text-white"
          : "text-zinc-500 hover:text-white"
      }`}
    >
      Admin

      {isActive("/admin") && (
        <span className="absolute -bottom-1 left-0 h-px w-full bg-blue-500" />
      )}
    </Link>
  )}
</nav>


          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen((value) => !value)}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                searchOpen
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <Search size={19} />
            </button>


            {/* Admin Access */}

              

            {/* Account */}

            <Link
              href="/account"
              aria-label="Account"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-900 hover:text-white sm:flex"
            >
              <User size={19} />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label="Shopping cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
            >
              <ShoppingBag size={19} />

              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-500 px-1 text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu */}
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileMenuOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-900 hover:text-white md:hidden"
            >
              {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>

        {/* Search */}
        {searchOpen && (
          <div className="border-t border-zinc-800 py-4">
            <form onSubmit={handleSearch} className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products..."
                autoFocus
                className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900 pl-11 pr-12 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-zinc-600"
              />

              <button
                type="submit"
                aria-label="Submit search"
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-white text-black transition hover:bg-zinc-200"
              >
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-zinc-800 py-5 md:hidden">
            <nav className="flex flex-col">
              {navigation.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`rounded-xl px-4 py-3.5 text-sm transition ${
                      active
                        ? "bg-zinc-900 text-white"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}

              <Link
                href="/account"
                onClick={closeMobileMenu}
                className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
              >
                <User size={18} />
                Account
              </Link>

              <Link
                href="/cart"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
              >
                <ShoppingBag size={18} />
                Cart
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
