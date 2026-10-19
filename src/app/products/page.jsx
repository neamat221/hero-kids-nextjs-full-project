import React from "react";
import products from "@/data/toys.json";
import ProductsGrid from "@/components/Product/ProductsGrid";
import RequireLogin from "@/components/Auth/RequireLogin";
import PageHero from "@/components/UI/PageHero";
import { buildMetadata } from "@/components/seo/meta";

export const metadata = buildMetadata({
  title: "All Products",
  description:
    "Browse our full collection of safe, creative and educational toys for kids at Hero Kids. Filter by price, rating and discount.",
  path: "/products",
});

const ProductsPage = () => {
  return (
    <RequireLogin
      returnTo="/products"
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      }
    >
      <div>
        <PageHero
          kicker="Shop"
          title="All Products"
          subtitle="Explore toys that spark curiosity, creativity and confidence in every child."
        />
        <div className="mx-auto max-w-7xl px-4 py-12">
          <ProductsGrid products={products} />
        </div>
      </div>
    </RequireLogin>
  );
};

export default ProductsPage;
