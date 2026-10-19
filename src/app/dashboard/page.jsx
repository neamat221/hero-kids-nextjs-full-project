import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import {
  FiPackage,
  FiUser,
  FiTag,
  FiGrid,
  FiShoppingBag,
} from "react-icons/fi";
import { getAuthStatus } from "@/action/session";
import {
  getAccountById,
  getRecentLogins,
  countAccounts,
} from "@/action/server/auth";
import { getAllProducts } from "@/action/server/product";
import { getOrdersByEmail } from "@/action/server/order";
import LogoutButton from "@/components/Auth/LogoutButton";
import OrderDetails from "@/components/Dashboard/OrderDetails";
import { buildMetadata } from "@/components/seo/meta";

export const metadata = buildMetadata({
  title: "Dashboard",
  description:
    "Your Hero Kids dashboard — browse the latest toys loaded from our store.",
  path: "/dashboard",
});

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 rounded-2xl border border-base-200 bg-base-100 p-5">
    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
      <Icon size={22} />
    </span>
    <div>
      <p className="font-display text-2xl font-bold leading-none">{value}</p>
      <p className="mt-1 text-sm text-base-content/60">{label}</p>
    </div>
  </div>
);

const DashboardSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-16">
    <span className="loading loading-spinner loading-lg text-primary" />
  </div>
);

async function DashboardContent() {
  await connection();
  const user = await getAuthStatus();
  if (!user) redirect("/login");

  const products = await getAllProducts();
  const [logins, accountCount, account, orders] = await Promise.all([
    getRecentLogins(5),
    countAccounts(),
    getAccountById(user.id),
    getOrdersByEmail(user.email),
  ]);
  const serializedOrders = orders.map((order) => ({
    ...order,
    _id: String(order._id),
    createdAt: order.createdAt
      ? new Date(order.createdAt).toISOString()
      : null,
  }));
  const avgPrice = products.length
    ? Math.round(
        products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length,
      )
    : 0;

  const displayName = account?.name ?? user.name;
  const displayEmail = account?.email ?? user.email;
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-gradient-to-br from-primary via-secondary to-primary p-8 text-primary-content shadow-2xl">
        <div>
          <p className="text-sm text-primary-content/80">
            Welcome back, {displayName}!
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">
            Your Dashboard
          </h1>
          <p className="mt-2 text-sm text-primary-content/90">
            {displayEmail}
          </p>
        </div>
        <LogoutButton className="btn btn-lg rounded-full border-0 bg-white/20 text-primary-content gap-2 hover:bg-white hover:text-primary" />
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FiPackage} label="Products in store" value={products.length} />
        <StatCard icon={FiTag} label="Average price" value={`৳${avgPrice}`} />
        <StatCard icon={FiUser} label="Registered accounts" value={accountCount} />
        <StatCard icon={FiShoppingBag} label="Orders placed" value={orders.length} />
      </div>

      {/* Account details */}
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-base-200 bg-base-100 p-6 lg:col-span-2">
          <h2 className="font-display text-2xl font-bold">Account Details</h2>
          <p className="mt-1 text-sm text-base-content/60">
            Loaded from the <code className="rounded bg-base-200 px-1">user</code>{" "}
            collection in MongoDB.
          </p>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                Full Name
              </dt>
              <dd className="mt-1 font-semibold">{displayName}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                Email Address
              </dt>
              <dd className="mt-1 font-semibold">{displayEmail}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                Member Since
              </dt>
              <dd className="mt-1 font-semibold">
                {account?.createdAt
                  ? new Date(account.createdAt).toLocaleDateString()
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                Role
              </dt>
              <dd className="mt-1">
                <span
                  className={`badge badge-sm ${
                    (account?.role ?? user.role) === "admin"
                      ? "badge-primary"
                      : "badge-ghost"
                  }`}
                >
                  {account?.role ?? user.role ?? "user"}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                Account ID
              </dt>
              <dd className="mt-1 truncate font-mono text-xs text-base-content/70">
                {account?._id ? String(account._id) : user.id}
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-base-200 bg-gradient-to-br from-secondary/10 to-primary/10 p-6 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-primary font-display text-3xl font-bold text-primary-content">
            {initials}
          </span>
          <p className="mt-2 font-semibold">{displayName}</p>
          <p className="text-sm text-base-content/60">{displayEmail}</p>
        </div>
      </div>

      {/* Order details */}
      <OrderDetails orders={serializedOrders} />

      {/* Login history */}
      {/* <div className="mt-10">
        <h2 className="font-display text-2xl font-bold">Recent Logins</h2>
        <p className="mt-1 text-sm text-base-content/60">
          Saved to the <code className="rounded bg-base-200 px-1">user</code>{" "}
          collection in MongoDB.
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-base-200">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th className="hidden sm:table-cell">Email</th>
                <th className="hidden md:table-cell">Logged In</th>
                <th className="hidden lg:table-cell">Device</th>
              </tr>
            </thead>
            <tbody>
              {logins.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-sm text-base-content/60">
                    No logins recorded yet.
                  </td>
                </tr>
              ) : (
                logins.map((login) => (
                  <tr key={String(login._id)} className="hover:bg-base-200/50">
                    <td className="font-semibold">{login.name ?? "—"}</td>
                    <td className="hidden sm:table-cell text-base-content/70">
                      {login.email ?? "—"}
                    </td>
                    <td className="hidden md:table-cell text-base-content/70">
                      {login.loggedInAt
                        ? new Date(login.loggedInAt).toLocaleString()
                        : "—"}
                    </td>
                    <td className="hidden lg:table-cell max-w-[16rem] truncate text-xs text-base-content/50">
                      {login.userAgent ?? "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div> */}

      {/* Products */}
      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Store Products</h2>
        <Link href="/products" className="btn btn-ghost btn-sm gap-2">
          <FiGrid /> View shop
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-base-300 py-20 text-center">
          <p className="font-display text-xl font-bold">No products found</p>
          <p className="mt-1 text-sm text-base-content/60">
            The database has no products yet. Run the seed script to load toys.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-base-200">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th className="hidden sm:table-cell">Price</th>
                <th className="hidden md:table-cell">Rating</th>
                <th className="hidden md:table-cell">Sold</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <tr key={String(product._id ?? i)} className="hover:bg-base-200/50">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-base-200">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-1 font-semibold">
                          {product.title}
                        </p>
                        <p className="line-clamp-1 text-xs text-base-content/60">
                          {product.bangla}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden font-display font-bold text-primary sm:table-cell">
                    ৳{product.price}
                  </td>
                  <td className="hidden md:table-cell">{product.ratings}</td>
                  <td className="hidden md:table-cell">{product.sold}</td>
                  <td className="text-right">
                    <Link
                      href={`/products/${String(product._id ?? i)}`}
                      className="btn btn-ghost btn-xs"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const DashboardPage = () => (
  <Suspense fallback={<DashboardSkeleton />}>
    <DashboardContent />
  </Suspense>
);

export default DashboardPage;
