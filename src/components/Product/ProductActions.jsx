"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiZap,
  FiHeart,
} from "react-icons/fi";
import { useCart } from "@/components/Cart/CartContext";
import { useWishlist } from "@/components/Wishlist/WishlistContext";
import { useAuthGate } from "@/components/Auth/useAuthGate";

const ProductActions = ({ product, index }) => {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { toggleItem, hasItem } = useWishlist();
  const { ensureLoggedIn } = useAuthGate();
  const price = product.price;
  const title = product.title;
  const loved = hasItem({ ...product, _index: index });

  const handleAdd = async () => {
    const ok = await ensureLoggedIn();
    if (!ok) return;
    addItem({ ...product, _index: index }, qty);
  };

  const handleBuyNow = async () => {
    const ok = await ensureLoggedIn();
    if (!ok) return;
    addItem({ ...product, _index: index }, qty);
    router.push("/card");
  };

  const handleLove = () => {
    toggleItem({ ...product, _index: index });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center rounded-full border border-base-300">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <FiMinus />
          </button>
          <span className="w-10 text-center font-bold">{qty}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => q + 1)}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <FiPlus />
          </button>
        </div>

        <p className="text-sm text-base-content/60">
          Total:{" "}
          <span className="font-display text-lg font-bold text-primary">
            ৳{price * qty}
          </span>
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleAdd}
          className="btn btn-primary btn-lg flex-1 rounded-full gap-2 shadow-lg shadow-primary/30"
        >
          <FiShoppingCart className="sm:hidden" />
          <FiShoppingCart />
          Add to Cart
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="btn btn-outline btn-lg flex-1 rounded-full gap-2"
        >
          <FiZap /> Buy Now
        </button>
        <button
          type="button"
          aria-label={
            loved ? `Remove ${title} from wishlist` : `Add ${title} to wishlist`
          }
          aria-pressed={loved}
          onClick={handleLove}
          className={`btn btn-lg btn-circle border ${
            loved
              ? "btn-primary border-transparent"
              : "btn-ghost border-base-300"
          }`}
        >
          <FiHeart className={loved ? "fill-current" : ""} />
        </button>
      </div>
    </div>
  );
};

export default ProductActions;
