"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;

  product: {
    id: string;
    name: string;
    image: string;
  };
};

type Address = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

type Order = {
  id: string;
  status: string;
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: string;

  address: Address;

  items: OrderItem[];
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/orders/${orderId}`
        );

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }

          throw new Error(
            data.message || "Failed to load order."
          );
        }

        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load order."
        );
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-zinc-500" />
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">
              Order not found
            </h1>

            <p className="mt-3 text-zinc-500">
              {error || "We couldn't find this order."}
            </p>

            <Link
              href="/account/orders"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Header */}

        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Link>

        <div className="mt-10 flex flex-col justify-between gap-5 border-b border-zinc-800 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-blue-500">
              Order details
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight">
              Order #{order.id.slice(-8)}
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <OrderStatus status={order.status} />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_350px]">
          {/* Main */}

          <div className="space-y-8">
            {/* Products */}

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <h2 className="text-xl font-semibold">
                Items
              </h2>

              <div className="mt-6 divide-y divide-zinc-800">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 py-5 first:pt-0 last:pb-0"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-900">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
                      <div>
                        <h3 className="font-medium">
                          {item.product.name}
                        </h3>

                        <p className="mt-1 text-sm text-zinc-500">
                          ${item.price.toFixed(2)} ×{" "}
                          {item.quantity}
                        </p>
                      </div>

                      <p className="shrink-0 font-medium">
                        $
                        {(
                          item.price * item.quantity
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Shipping Address */}

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <h2 className="text-xl font-semibold">
                Shipping address
              </h2>

              <div className="mt-5 text-sm leading-7 text-zinc-400">
                <p className="font-medium text-white">
                  {order.address.firstName}{" "}
                  {order.address.lastName}
                </p>

                <p>{order.address.phone}</p>

                <p className="mt-2">
                  {order.address.address}
                  <br />
                  {order.address.city},{" "}
                  {order.address.postalCode}
                  <br />
                  {order.address.country}
                </p>
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

                <span>
                  ${order.subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-zinc-500">
                <span>Shipping</span>

                <span>
                  {order.shipping === 0
                    ? "Free"
                    : `$${order.shipping.toFixed(2)}`}
                </span>
              </div>

              <div className="border-t border-zinc-800 pt-4">
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>

                  <span>
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function OrderStatus({
  status,
}: {
  status: string;
}) {
  const statusStyles: Record<string, string> = {
    PENDING:
      "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",

    PROCESSING:
      "border-blue-500/20 bg-blue-500/10 text-blue-400",

    SHIPPED:
      "border-purple-500/20 bg-purple-500/10 text-purple-400",

    DELIVERED:
      "border-green-500/20 bg-green-500/10 text-green-400",

    CANCELLED:
      "border-red-500/20 bg-red-500/10 text-red-400",
  };

  return (
    <span
      className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-xs font-medium ${
        statusStyles[status] ??
        "border-zinc-700 bg-zinc-800 text-zinc-400"
      }`}
    >
      {status}
    </span>
  );
}