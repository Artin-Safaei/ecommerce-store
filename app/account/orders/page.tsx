"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Package } from "lucide-react";
import { useRouter } from "next/navigation";

type Order = {
  id: string;
  status: string;
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: string;

  items: {
    id: string;
    quantity: number;
    price: number;

    product: {
      id: string;
      name: string;
      image: string;
    };
  }[];
};

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/orders");

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }

          throw new Error(
            data.message || "Failed to load orders."
          );
        }

        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load orders."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-zinc-500" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to account
          </Link>

          <p className="mt-8 text-sm uppercase tracking-[0.25em] text-blue-500">
            Account
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Your orders
          </h1>

          <p className="mt-3 text-zinc-500">
            View and track your previous orders.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function OrderCard({
  order,
}: {
  order: Order;
}) {
  return (
    <Link
      href={`/account/orders/${order.id}`}
      className="group block rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-zinc-700 hover:bg-zinc-900/70"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-semibold">
              Order #{order.id.slice(-8)}
            </h2>

            <OrderStatus status={order.status} />
          </div>

          <p className="mt-2 text-sm text-zinc-500">
            {new Date(order.createdAt).toLocaleDateString(
              undefined,
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </p>
        </div>

        <div className="flex items-center justify-between gap-8 md:justify-end">
          <div className="text-left md:text-right">
            <p className="text-sm text-zinc-500">
              {order.items.length}{" "}
              {order.items.length === 1 ? "item" : "items"}
            </p>

            <p className="mt-1 text-lg font-semibold">
              ${order.total.toFixed(2)}
            </p>
          </div>

          <ArrowRight className="h-5 w-5 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-white" />
        </div>
      </div>

      <div className="mt-6 flex gap-3 overflow-hidden">
        {order.items.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-zinc-900"
          >
            <img
              src={item.product.image}
              alt={item.product.name}
              className="h-full w-full object-cover"
            />
          </div>
        ))}

        {order.items.length > 4 && (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-sm text-zinc-500">
            +{order.items.length - 4}
          </div>
        )}
      </div>
    </Link>
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
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
        statusStyles[status] ??
        "border-zinc-700 bg-zinc-800 text-zinc-400"
      }`}
    >
      {status}
    </span>
  );
}

function EmptyOrders() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-20 text-center">
      <Package className="mx-auto h-10 w-10 text-zinc-700" />

      <h2 className="mt-5 text-xl font-semibold">
        No orders yet
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
        You haven't placed any orders yet. Start shopping
        and your orders will appear here.
      </p>

      <Link
        href="/shop"
        className="mt-7 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
      >
        Start shopping
      </Link>
    </div>
  );
}