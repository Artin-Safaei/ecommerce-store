import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Mail, User, ShoppingBag, Heart, MapPin } from "lucide-react";
import Link from "next/link";

import { prisma } from "@/app/lib/prisma";
import { verifySession } from "@/app/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function AccountPage() {
  const cookieStore = await cookies();

  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    redirect("/login");
  }

  const session = await verifySession(sessionToken);

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-zinc-800 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-blue-500">
              Account
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              Welcome back{user.name ? `, ${user.name}` : ""}
            </h1>

            <p className="mt-4 text-zinc-500">
              Manage your account, orders and preferences.
            </p>
          </div>

          <LogoutButton />
        </div>

        {/* Account information */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800">
                <User className="h-5 w-5 text-zinc-300" />
              </div>

              <div>
                <p className="text-sm text-zinc-500">Name</p>
                <p className="mt-1 font-medium">
                  {user.name || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800">
                <Mail className="h-5 w-5 text-zinc-300" />
              </div>

              <div>
                <p className="text-sm text-zinc-500">Email</p>
                <p className="mt-1 font-medium">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account sections */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <AccountCard
            icon={<ShoppingBag className="h-5 w-5" />}
            title="Orders"
            description="View your order history"
            href="orders"
          />
          <AccountCard
            icon={<MapPin className="h-5 w-5" />}
            title="Addresses"
            description="Manage your shipping addresses"
            href="addresses"
          />

          <AccountCard
            icon={<Heart className="h-5 w-5" />}
            title="Wishlist"
            description="View your saved products"
            href="wishlist"
          />

          <AccountCard
            icon={<User className="h-5 w-5" />}
            title="Profile"
            description="Manage your profile"
            href="profile"
          />
        </div>
      </div>
    </main>
  );
}

function AccountCard({
  icon,
  title,
  description,
  href
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href:string;
}) {
  return (
    <Link href={`/account/${href}`}>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 transition hover:border-zinc-700 hover:bg-zinc-900/60">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-zinc-300">
          {icon}
        </div>

        <h2 className="mt-5 font-semibold">{title}</h2>

        <p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p>
      </div>
    </Link>
  );
}
