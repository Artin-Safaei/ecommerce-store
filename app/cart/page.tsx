"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";

import { useCartStore } from "../store/cart-store";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900 text-zinc-600">
              <ShoppingBagIcon />
            </div>

            <h1 className="mt-6 text-3xl font-bold">Your cart is empty</h1>

            <p className="mt-3 text-zinc-500">
              Looks like you haven't added anything yet.
            </p>

            <Link
              href="/shop"
              className="mt-8 inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <Link
          href="/shop"
          className="mb-10 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Continue Shopping
        </Link>

        <h1 className="text-4xl font-bold tracking-tight">Your Cart</h1>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
          {/* Items */}
          <div className="space-y-5">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4"
              >
                {/* Image */}
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-zinc-900">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-600">
                      {item.category.name}
                    </p>

                    <h2 className="mt-1 truncate font-medium">{item.name}</h2>

                    <p className="mt-1 text-sm text-zinc-500">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    {/* Quantity */}
                    <div className="flex items-center rounded-full border border-zinc-800">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="p-2.5 text-zinc-500 transition hover:text-white"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="w-8 text-center text-sm">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="p-2.5 text-zinc-500 transition hover:text-white"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex items-center gap-2 text-xs text-zinc-600 transition hover:text-red-400"
                    >
                      <Trash2 size={15} />
                      Remove
                    </button>
                  </div>
                </div>

                {/* Item total */}
                <div className="hidden text-right sm:block">
                  <p className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <aside className="h-fit rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="text-lg font-semibold">Order Summary</h2>

            <div className="my-6 space-y-4 text-sm">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>

                <span className="text-white">${totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-zinc-500">
                <span>Shipping</span>

                <span className="text-white">Free</span>
              </div>

              <div className="h-px bg-zinc-800" />

              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>

                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full rounded-full bg-white py-4 text-center text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}

function ShoppingBagIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8h12l1 13H5L6 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  );
}
