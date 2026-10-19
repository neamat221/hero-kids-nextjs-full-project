"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from "react-icons/fi";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useCart } from "@/components/Cart/CartContext";

const CartPage = () => {
  const router = useRouter();
  const { items, count, subtotal, updateQty, removeItem, clearCart, ready } =
    useCart();

  const handleRemoveItem = async (item) => {
    const result = await Swal.fire({
      title: "Remove item?",
      text: `"${item.title}" will be removed from your cart.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      removeItem(item.id);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Item removed from cart",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleClearCart = async () => {
    const result = await Swal.fire({
      title: "Clear cart?",
      text: "All items will be removed from your cart.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, clear it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      clearCart();
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Cart cleared",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const FREE_DISCOUNT_MIN = 2000;
  const DISCOUNT_RATE = 0.15;
  const discount =
    subtotal >= FREE_DISCOUNT_MIN ? Math.round(subtotal * DISCOUNT_RATE) : 0;
  const total = subtotal - discount;
  const remaining = FREE_DISCOUNT_MIN - subtotal;

  if (!ready) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold md:text-4xl">
            Shopping Cart
          </h1>
          <p className="mt-1 text-sm text-base-content/60">
            {count} {count === 1 ? "item" : "items"} ready for checkout
          </p>
        </div>
      </div>

      {subtotal > 0 && (
        <div className="mb-8 max-w-xl rounded-2xl border border-base-200 bg-base-200/50 p-4">
          <div className="flex items-center justify-between text-xs font-medium text-base-content/70">
            <span>
              {discount > 0
                ? "🎉 You unlocked 15% OFF!"
                : `Add ৳${remaining} more for free delivery + 15% OFF`}
            </span>
            <span>৳{subtotal} / ৳{FREE_DISCOUNT_MIN}</span>
          </div>
          <progress
            className="progress progress-primary mt-2 w-full"
            value={Math.min(subtotal, FREE_DISCOUNT_MIN)}
            max={FREE_DISCOUNT_MIN}
            aria-label="Progress toward 15% discount"
          />
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-base-300 py-20 text-center">
          <FiShoppingBag className="mx-auto text-base-content/30" size={48} />
          <p className="mt-4 font-display text-xl font-bold">
            Your cart is empty
          </p>
          <p className="mt-1 text-sm text-base-content/60">
            Add some toys to get started.
          </p>
          <Link
            href="/products"
            className="btn btn-primary mt-6 rounded-full"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-2xl border border-base-200 p-4"
              >
                <Link
                  href={`/products/${item.id}`}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-base-200"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <Link href={`/products/${item.id}`}>
                    <h3 className="line-clamp-1 font-semibold transition-colors hover:text-primary">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="line-clamp-1 text-xs text-base-content/60">
                    {item.bangla}
                  </p>
                  <p className="mt-1 font-display font-bold text-primary">
                    ৳{item.price}
                  </p>
                </div>

                <div className="flex items-center rounded-full border border-base-300">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="btn btn-ghost btn-sm btn-circle"
                  >
                    <FiMinus />
                  </button>
                  <span className="w-8 text-center font-bold">{item.qty}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="btn btn-ghost btn-sm btn-circle"
                  >
                    <FiPlus />
                  </button>
                </div>

                <button
                  type="button"
                  aria-label="Remove item"
                  onClick={() => handleRemoveItem(item)}
                  className="btn btn-ghost btn-sm btn-circle text-error"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={handleClearCart}
              className="btn btn-ghost btn-sm text-base-content/60"
            >
              Clear cart
            </button>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-base-200 p-6 lg:sticky lg:top-24">
              <h2 className="mb-4 font-display text-xl font-bold">
                Order Summary
              </h2>
              <div className="flex justify-between text-sm text-base-content/70">
                <span>Items</span>
                <span>{count}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm text-base-content/70">
                <span>Subtotal</span>
                <span>৳{subtotal}</span>
              </div>
              {discount > 0 ? (
                <div className="mt-2 flex justify-between text-sm font-semibold text-success">
                  <span>Discount (15%)</span>
                  <span>-৳{discount}</span>
                </div>
              ) : (
                <p className="mt-3 rounded-xl bg-base-200/60 p-3 text-xs text-base-content/70">
                  Add ৳{remaining} more to get <strong>15% OFF</strong> on your
                  order.
                </p>
              )}
              <div className="my-4 border-t border-base-200" />
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-display text-2xl font-bold text-primary">
                  ৳{total}
                </span>
              </div>
              <button
                type="button"
                onClick={() => router.push("/checkout")}
                className="btn btn-primary btn-lg mt-6 w-full rounded-full gap-2 shadow-lg shadow-primary/30"
              >
                <FiShoppingBag /> Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
