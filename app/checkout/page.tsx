"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

import { useCartStore } from "@/app/store/cart-store";

type Address = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

export default function CheckoutPage() {
  const router = useRouter();

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [error, setError] = useState("");

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [items]);

  const shipping = 0;

  const total = subtotal + shipping;

  useEffect(() => {
    async function loadAddresses() {
      try {
        setLoadingAddresses(true);
        setError("");

        const response = await fetch("/api/addresses");

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }

          throw new Error(
            data.message || "Failed to load addresses."
          );
        }

        setAddresses(data);

        if (data.length > 0) {
          setSelectedAddressId(data[0].id);
        }
      } catch (error) {
        console.error("Failed to load addresses:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load addresses."
        );
      } finally {
        setLoadingAddresses(false);
      }
    }

    loadAddresses();
  }, [router]);

  async function handlePlaceOrder() {
    if (!selectedAddressId) {
      setError("Please select a shipping address.");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setPlacingOrder(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addressId: selectedAddressId,
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }

        throw new Error(
          data.message || "Failed to place order."
        );
      }

      clearCart();

      router.push(`/account/orders/${data.order.id}`);
      router.refresh();
    } catch (error) {
      console.error("Failed to place order:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to place order."
      );
    } finally {
      setPlacingOrder(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">
              Your cart is empty
            </h1>

            <p className="mt-3 text-zinc-500">
              Add some products before checking out.
            </p>

            <Link
              href="/shop"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              Continue shopping
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to cart
          </Link>

          <p className="mt-8 text-sm uppercase tracking-[0.25em] text-blue-500">
            Checkout
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Complete your order
          </h1>

          <p className="mt-4 text-zinc-500">
            Select a shipping address and review your order.
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left */}
          <div className="space-y-8">
            {/* Addresses */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    Shipping address
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    Choose where you want your order delivered.
                  </p>
                </div>

                <Link
                  href="/account/addresses"
                  className="text-sm font-medium text-blue-500 transition hover:text-blue-400"
                >
                  Manage
                </Link>
              </div>

              {loadingAddresses ? (
                <div className="flex items-center justify-center py-12 text-zinc-500">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : addresses.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-zinc-800 p-8 text-center">
                  <MapPin className="mx-auto h-7 w-7 text-zinc-600" />

                  <p className="mt-3 font-medium">
                    No saved addresses
                  </p>

                  <p className="mt-2 text-sm text-zinc-500">
                    Add an address before placing your order.
                  </p>

                  <Link
                    href="/account/addresses"
                    className="mt-5 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black"
                  >
                    Add address
                  </Link>
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  {addresses.map((address) => {
                    const selected =
                      selectedAddressId === address.id;

                    return (
                      <button
                        key={address.id}
                        type="button"
                        onClick={() =>
                          setSelectedAddressId(address.id)
                        }
                        className={`w-full rounded-xl border p-4 text-left transition ${
                          selected
                            ? "border-blue-500 bg-blue-500/5"
                            : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                              selected
                                ? "border-blue-500 bg-blue-500"
                                : "border-zinc-700"
                            }`}
                          >
                            {selected && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>

                          <div>
                            <p className="font-medium">
                              {address.firstName}{" "}
                              {address.lastName}
                            </p>

                            <p className="mt-1 text-sm text-zinc-500">
                              {address.phone}
                            </p>

                            <p className="mt-3 text-sm leading-6 text-zinc-400">
                              {address.address}
                              <br />
                              {address.city},{" "}
                              {address.postalCode}
                              <br />
                              {address.country}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Order items */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <h2 className="text-xl font-semibold">
                Your items
              </h2>

              <div className="mt-6 divide-y divide-zinc-800">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 py-5 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {item.name}
                      </p>

                      <p className="mt-1 text-sm text-zinc-500">
                        ${item.price.toFixed(2)} ×{" "}
                        {item.quantity}
                      </p>
                    </div>

                    <p className="shrink-0 font-medium">
                      $
                      {(item.price * item.quantity).toFixed(
                        2
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Summary */}
          <aside className="h-fit rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 lg:sticky lg:top-8">
            <h2 className="text-xl font-semibold">
              Order summary
            </h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-zinc-500">
                <span>Shipping</span>
                <span>
                  {shipping === 0
                    ? "Free"
                    : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              <div className="border-t border-zinc-800 pt-4">
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={
                placingOrder ||
                loadingAddresses ||
                addresses.length === 0 ||
                !selectedAddressId
              }
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {placingOrder ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Placing order...
                </>
              ) : (
                "Place order"
              )}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-zinc-600">
              Your order will be created securely using your
              saved address and the products in your cart.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}