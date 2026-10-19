"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";
import { useCart } from "@/components/Cart/CartContext";
import { useWishlist } from "@/components/Wishlist/WishlistContext";
import { useAuthGate } from "@/components/Auth/useAuthGate";

const ProductCard = ({ product, index }) => {
  const discount = product.discount ?? product.percentage;
  const { addItem } = useCart();
  const { toggleItem, hasItem } = useWishlist();
  const { ensureLoggedIn } = useAuthGate();
  const loved = hasItem({ ...product, _index: index });

  const handleAdd = async () => {
    const ok = await ensureLoggedIn();
    if (!ok) return;
    addItem({ ...product, _index: index }, 1);
  };

  const handleLove = () => {
    toggleItem({ ...product, _index: index });
  };

  return (
    <div className="group card bg-base-100 border border-base-200 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-primary/30">
      <figure className="relative overflow-hidden bg-gradient-to-br from-base-200 to-base-300">
        {discount ? (
          <span className="absolute left-3 top-3 z-10 badge badge-primary border-0 font-semibold text-primary-content shadow">
            {discount}% OFF
          </span>
        ) : null}
        <button
          type="button"
          aria-label={loved ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={loved}
          onClick={handleLove}
          className={`absolute right-3 top-3 z-10 btn btn-sm btn-circle border-0 backdrop-blur transition ${
            loved
              ? "bg-primary text-primary-content opacity-100"
              : "bg-base-100/80 text-base-content/70 opacity-0 group-hover:opacity-100 hover:text-primary"
          }`}
        >
          <FiHeart size={16} className={loved ? "fill-current" : ""} />
        </button>
        <Link href={`/products/${index}`} className="block">
          <Image
            src={product.image}
            alt={product.title}
            width={500}
            height={500}
            className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
      </figure>

      <div className="card-body gap-2 p-4">
        <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
          <FiStar className="fill-current" size={14} />
          {product.ratings}
          <span className="text-base-content/40">
            · {product.sold} sold
          </span>
        </div>

        <Link href={`/products/${index}`}>
          <h3 className="card-title line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-primary">
            {product.title}
          </h3>
        </Link>
        <p className="line-clamp-1 text-xs text-base-content/60">
          {product.bangla}
        </p>

        <div className="mt-1 flex items-center justify-between">
          <span className="font-display text-lg font-bold text-primary">
            ৳{product.price}
          </span>
          <button
            type="button"
            aria-label="Add to cart"
            onClick={handleAdd}
            className="btn btn-primary btn-sm rounded-full gap-1"
          >
            <FiShoppingCart size={15} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
