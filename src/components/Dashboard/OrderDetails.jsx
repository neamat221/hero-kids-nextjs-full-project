"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiShoppingBag, FiMapPin, FiX } from "react-icons/fi";

const mapEmbedUrl = (location) =>
  `https://www.google.com/maps?q=${encodeURIComponent(location)}&z=15&output=embed`;

const mapSearchUrl = (location) =>
  `https://www.google.com/maps/search/${encodeURIComponent(location)}`;

export default function OrderDetails({ orders }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((order) =>
      String(order.trxId ?? "").toLowerCase().includes(q),
    );
  }, [orders, query]);

  const isSearching = Boolean(query.trim());

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Order Details</h2>
          <p className="mt-1 text-sm text-base-content/60">
            Search a transaction ID to see the order and its delivery area on
            the map.
          </p>
        </div>
        <span className="badge badge-primary badge-outline">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </span>
      </div>

      {/* Transaction ID search */}
      <div className="mt-5 max-w-md">
        <label className="input input-bordered flex w-full items-center gap-2 rounded-full bg-base-100">
          <FiSearch className="shrink-0 opacity-60" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by transaction ID (e.g. HC1234567890)"
            className="grow"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="btn btn-ghost btn-xs btn-circle"
            >
              <FiX size={16} />
            </button>
          )}
        </label>
        {query.trim() && (
          <p className="mt-2 text-xs text-base-content/60">
            {filtered.length} of {orders.length}{" "}
            {orders.length === 1 ? "order" : "orders"} match this transaction
            ID.
          </p>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-base-300 py-16 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
            <FiShoppingBag size={28} />
          </span>
          <p className="mt-4 font-display text-xl font-bold">No orders yet</p>
          <p className="mt-1 text-sm text-base-content/60">
            Once your payment is done, your order details will show up here.
          </p>
          <Link
            href="/products"
            className="btn btn-primary btn-sm mt-5 rounded-full"
          >
            Start shopping
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-base-300 py-16 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-base-200 text-base-content/50">
            <FiSearch size={28} />
          </span>
          <p className="mt-4 font-display text-xl font-bold">
            No transaction found
          </p>
          <p className="mt-1 text-sm text-base-content/60">
            Nothing matches &ldquo;{query.trim()}&rdquo;. Check the transaction
            ID from your receipt.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {filtered.map((order) => (
            <div
              key={order._id}
              className="overflow-hidden rounded-3xl border border-gray-600 bg-gray-500 text-white"
            >
              {/* Order header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/20 bg-black/10 px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/20 text-white">
                    <FiShoppingBag size={18} />
                  </span>
                  <div>
                    <p className="font-mono text-sm font-bold">{order.trxId}</p>
                    <p className="text-xs text-white/70">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`badge badge-sm ${
                      (order.status ?? "paid") === "paid"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {order.status ?? "paid"}
                  </span>
                  <span className="badge badge-outline badge-sm border-white/50 capitalize text-white">
                    {order.paymentMethod ?? "bkash"}
                  </span>
                </div>
              </div>

              {/* Ordered items */}
              <div className="divide-y divide-white/20 px-5">
                {(order.items ?? []).map((item, idx) => (
                  <div
                    key={item.id ?? idx}
                    className="flex items-center gap-3 py-3"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-black/20">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title ?? "Item"}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="grid h-full w-full place-items-center text-white/60">
                          <FiShoppingBag size={16} />
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-semibold">
                        {item.title ?? "Untitled item"}
                      </p>
                      <p className="text-xs text-white/70">
                        ৳{item.price} × {item.qty}
                      </p>
                    </div>
                    <p className="font-display text-sm font-bold">
                      ৳{(item.price || 0) * (item.qty || 1)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals + delivery */}
              <div className="grid gap-4 border-t border-white/20 bg-black/10 px-5 py-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                    Deliver to
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {order.name ?? "—"}
                  </p>
                  <p className="text-sm text-white/80">
                    {order.location ?? "—"}
                  </p>
                  <p className="text-sm text-white/80">{order.phone ?? "—"}</p>
                </div>
                <dl className="space-y-1 text-sm sm:text-right">
                  <div className="flex justify-between gap-4 sm:justify-end">
                    <dt className="text-white/70">Subtotal</dt>
                    <dd>৳{order.subtotal}</dd>
                  </div>
                  {Number(order.discount) > 0 && (
                    <div className="flex justify-between gap-4 sm:justify-end">
                      <dt className="text-white/70">Discount</dt>
                      <dd className="text-white/90">-৳{order.discount}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-4 font-display font-bold sm:justify-end">
                    <dt>Total paid</dt>
                    <dd className="text-white">৳{order.total}</dd>
                  </div>
                </dl>
              </div>

              {/* Delivery area map — only shown after a transaction ID search */}
              <div className="border-t border-white/20 px-5 py-4">
                {!isSearching ? (
                  <p className="flex flex-wrap items-center justify-center gap-1 rounded-2xl border border-dashed border-white/30 px-4 py-6 text-center text-sm text-white/70">
                    Search transaction ID
                    <span className="font-mono font-bold text-white">
                      {order.trxId}
                    </span>
                    to show the delivery area on the map.
                  </p>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/60">
                        <FiMapPin /> Delivery area
                      </p>
                      {order.location && (
                        <a
                          href={mapSearchUrl(order.location)}
                          target="_blank"
                          rel="noreferrer"
                          className="link link-primary text-xs text-white underline-offset-2 hover:text-white"
                        >
                          View on Google Maps
                        </a>
                      )}
                    </div>
                    {order.location ? (
                      <div className="mt-3 h-56 overflow-hidden rounded-2xl border border-white/20 bg-black/20">
                        <iframe
                          title={`Delivery area for ${order.trxId}`}
                          src={mapEmbedUrl(order.location)}
                          width="100%"
                          height="100%"
                          className="h-full w-full"
                          style={{ border: 0 }}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <p className="mt-3 rounded-2xl border border-dashed border-white/30 px-4 py-6 text-center text-sm text-white/70">
                        No delivery location provided for this order.
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
