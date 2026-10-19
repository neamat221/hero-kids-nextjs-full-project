"use client";

import React, { useMemo, useState } from "react";
import { FiSearch, FiSliders } from "react-icons/fi";
import ProductCard from "./ProductCard";

const ProductsGrid = ({ products }) => {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");

  const indexed = useMemo(
    () => products.map((p, i) => ({ ...p, _index: i })),
    [products],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = indexed.filter(
      (p) =>
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.bangla.toLowerCase().includes(q),
    );

    switch (sort) {
      case "price-low":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.ratings - a.ratings);
        break;
      case "discount":
        list = [...list].sort(
          (a, b) =>
            (b.discount ?? b.percentage ?? 0) -
            (a.discount ?? a.percentage ?? 0),
        );
        break;
      default:
        break;
    }

    return list;
  }, [indexed, query, sort]);

  return (
    <div>
      {/* Controls */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="input input-bordered flex w-full items-center gap-2 rounded-2xl bg-base-200/60 sm:max-w-sm">
          <FiSearch className="text-base-content/50" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search toys by name..."
            className="grow"
          />
        </label>

        <label className="flex items-center gap-2 self-start rounded-2xl border border-base-300 bg-base-200/60 px-4 py-2.5 text-sm">
          <FiSliders className="text-base-content/50" />
          <span className="hidden text-base-content/60 sm:inline">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-transparent font-medium outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="discount">Biggest Discount</option>
          </select>
        </label>
      </div>

      <p className="mb-4 text-sm text-base-content/60">
        Showing{" "}
        <span className="font-semibold text-base-content">
          {visible.length}
        </span>{" "}
        of {products.length} products
      </p>

      {visible.length ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {visible.map((product) => (
            <ProductCard
              key={product._index}
              product={product}
              index={product._index}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-base-300 py-20 text-center">
          <p className="font-display text-xl font-bold">No toys found</p>
          <p className="mt-1 text-sm text-base-content/60">
            Try a different search term.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductsGrid;
