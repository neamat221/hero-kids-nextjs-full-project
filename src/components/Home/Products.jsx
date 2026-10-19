import React from "react";
import Link from "next/link";
import { connection } from "next/server";
import { FiArrowRight, FiLogIn } from "react-icons/fi";
import products from "@/data/toys.json";
import ProductCard from "@/components/Product/ProductCard";
import { getAuthStatus } from "@/action/session";

const Products = async () => {
  await connection();
  const user = await getAuthStatus();
  const featured = products.slice(0, 8);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-10 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wide text-primary">
            Our Collection
          </span>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Featured Products
          </h2>
        </div>
        <Link href="/products" className="btn btn-outline rounded-full gap-2">
          View All <FiArrowRight />
        </Link>
      </div>

      {user ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {featured.map((product, i) => (
            <ProductCard key={i} product={product} index={i} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-base-300 bg-base-200/40 px-6 py-16 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
            <FiLogIn size={28} />
          </span>
          <p className="mt-5 font-display text-2xl font-bold">
            Login to view our products
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-base-content/60">
            Sign in to browse the full toy collection, add items to your cart
            and checkout securely.
          </p>
          <Link
            href="/login?callbackUrl=%2Fproducts"
            className="btn btn-primary mt-6 rounded-full gap-2 px-8 shadow-lg shadow-primary/30"
          >
            <FiLogIn /> Login Now
          </Link>
        </div>
      )}
    </section>
  );
};

export default Products;
