"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { useWishlist } from "@/components/Wishlist/WishlistContext";
import { useCart } from "@/components/Cart/CartContext";
import { useAuthGate } from "@/components/Auth/useAuthGate";

const WishlistPage = () => {
  const { items, count, removeItem, clearWishlist, ready } = useWishlist();
  const { addItem } = useCart();
  const { ensureLoggedIn } = useAuthGate();

  const handleAdd = async (item) => {
    const ok = await ensureLoggedIn();
    if (!ok) return;
    addItem(item, 1);
  };

  if (!ready) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          My Wishlist
        </h1>
        {count > 0 ? (
          <button
            type="button"
            onClick={clearWishlist}
            className="btn btn-ghost btn-sm text-base-content/60"
          >
            Clear all
          </button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-base-300 py-20 text-center">
          <FiHeart className="mx-auto text-base-content/30" size={48} />
          <p className="mt-4 font-display text-xl font-bold">
            Your wishlist is empty
          </p>
          <p className="mt-1 text-sm text-base-content/60">
            Tap the heart on a toy to save it here.
          </p>
          <Link href="/products" className="btn btn-primary mt-6 rounded-full">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group card bg-base-100 border border-base-200 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-primary/30"
            >
              <figure className="relative overflow-hidden bg-gradient-to-br from-base-200 to-base-300">
                <button
                  type="button"
                  aria-label="Remove from wishlist"
                  onClick={() => removeItem(item.id)}
                  className="absolute right-3 top-3 z-10 btn btn-sm btn-circle bg-base-100/80 border-0 text-error backdrop-blur"
                >
                  <FiTrash2 size={16} />
                </button>
                <Link href={`/products/${item.id}`} className="block">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={500}
                    height={500}
                    className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </Link>
              </figure>

              <div className="card-body gap-2 p-4">
                <Link href={`/products/${item.id}`}>
                  <h3 className="card-title line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-primary">
                    {item.title}
                  </h3>
                </Link>
                <p className="line-clamp-1 text-xs text-base-content/60">
                  {item.bangla}
                </p>

                <div className="mt-1 flex items-center justify-between">
                  <span className="font-display text-lg font-bold text-primary">
                    ৳{item.price}
                  </span>
                  <button
                    type="button"
                    aria-label="Add to cart"
                    onClick={() => handleAdd(item)}
                    className="btn btn-primary btn-sm rounded-full gap-1"
                  >
                    <FiShoppingCart size={15} />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
