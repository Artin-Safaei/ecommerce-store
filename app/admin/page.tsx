import { redirect } from "next/navigation";

import { getCurrentAdmin } from "@/app/lib/admin";

export default async function AdminPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/account");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-blue-500">
            Administration
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Admin Dashboard
          </h1>

          <p className="mt-3 text-zinc-500">
            Welcome back, {admin.name || admin.email}.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Products"
            value="—"
            href="/admin/products"
          />

          <DashboardCard
            title="Orders"
            value="—"
            href="/admin/orders"
          />

          <DashboardCard
            title="Users"
            value="—"
            href="/admin/users"
          />

          <DashboardCard
            title="Stock"
            value="—"
            href="/admin/categories"
          />
        </div>
      </div>
    </main>
  );
}

function DashboardCard({
  title,
  value,
  href,
}: {
  title: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-zinc-700 hover:bg-zinc-900"
    >
      <p className="text-sm text-zinc-500">
        {title}
      </p>

      <p className="mt-3 text-3xl font-bold">
        {value}
      </p>

      <p className="mt-4 text-sm text-blue-500">
        Manage →
      </p>
    </a>
  );
}