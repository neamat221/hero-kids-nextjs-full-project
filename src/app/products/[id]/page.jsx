import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/action/server/product";
import products from "@/data/toys.json";
import ProductCard from "@/components/Product/ProductCard";
import ProductActions from "@/components/Product/ProductActions";
import RequireLogin from "@/components/Auth/RequireLogin";
import { buildMetadata, siteUrl } from "@/components/seo/meta";
import {
  FiChevronRight,
  FiStar,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiCheck,
} from "react-icons/fi";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return buildMetadata({
    title: product.title,
    description: product.bangla,
    path: `/products/${id}`,
    images: [{ url: product.image, alt: product.title }],
  });
}

const Stars = ({ value }) => {
  const full = Math.round(value);
  return (
    <span className="flex items-center gap-0.5 text-amber-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <FiStar
          key={i}
          size={16}
          className={i < full ? "fill-current" : "text-base-300"}
        />
      ))}
    </span>
  );
};

const trust = [
  { icon: FiTruck, label: "Free delivery ৳2000+" },
  { icon: FiShield, label: "Non-toxic & safe" },
  { icon: FiRefreshCw, label: "7-day easy return" },
];

const ProductDetails = async ({ params }) => {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const discount = product.discount ?? product.percentage;
  const paragraphs = product.description
    .split("\n\n")
    .filter((p) => p.trim() !== "");

  const productIndex = products.findIndex((p) => p.title === product.title);

  const related = products
    .map((p, i) => ({ ...p, _index: i }))
    .filter((p) => p.title !== product.title)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.title,
        image: [product.image],
        description: product.bangla,
        brand: { "@type": "Brand", name: "Hero Kids" },
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "BDT",
          availability: "https://schema.org/InStock",
          url: `${siteUrl}/products/${id}`,
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.ratings,
          reviewCount: product.reviews,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: "Products",
            item: `${siteUrl}/products`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.title,
            item: `${siteUrl}/products/${id}`,
          },
        ],
      },
    ],
  };

  return (
    <RequireLogin
      returnTo={`/products/${id}`}
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      }
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-base-content/60">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <FiChevronRight size={14} />
          <Link href="/products" className="hover:text-primary">
            Products
          </Link>
          <FiChevronRight size={14} />
          <span className="line-clamp-1 text-base-content">
            {product.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative overflow-hidden rounded-3xl border border-base-200 bg-gradient-to-br from-base-200 to-base-300 p-6">
              {discount ? (
                <span className="absolute left-5 top-5 z-10 badge badge-primary border-0 font-semibold text-primary-content shadow">
                  {discount}% OFF
                </span>
              ) : null}
              <Image
                src={product.image}
                alt={product.title}
                width={700}
                height={700}
                className="h-auto w-full rounded-2xl object-cover"
                priority
              />
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-base-200 bg-base-200"
                >
                  <Image
                    src={product.image}
                    alt={`${product.title} view ${i + 1}`}
                    width={160}
                    height={160}
                    className="h-20 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div className="flex items-center gap-3 text-sm">
              <Stars value={product.ratings} />
              <span className="font-semibold">{product.ratings}</span>
              <span className="text-base-content/50">
                · {product.reviews} reviews · {product.sold} sold
              </span>
            </div>

            <h1 className="font-display text-3xl font-bold leading-tight md:text-4xl">
              {product.title}
            </h1>
            <p className="text-base-content/70">{product.bangla}</p>

            <div className="flex items-end gap-3 rounded-2xl bg-base-200/60 p-4">
              <span className="font-display text-3xl font-bold text-primary">
                ৳{product.price}
              </span>
              {discount ? (
                <span className="badge badge-success border-0 text-white">
                  Save {discount}%
                </span>
              ) : null}
            </div>

            {product.sizes?.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold">Sizes:</span>
                {product.sizes.map((size) => (
                  <span
                    key={size}
                    className="badge badge-outline badge-lg rounded-full"
                  >
                    {size}
                  </span>
                ))}
              </div>
            )}

            {product.color?.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold">Colors:</span>
                {product.color.map((color) => (
                  <span
                    key={color}
                    className="badge badge-outline badge-lg rounded-full"
                  >
                    {color}
                  </span>
                ))}
              </div>
            )}

            <ProductActions product={product} index={productIndex} />

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {trust.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1 rounded-2xl border border-base-200 p-3 text-center"
                >
                  <Icon className="text-primary" size={20} />
                  <span className="text-xs text-base-content/70">{label}</span>
                </div>
              ))}
            </div>

            {/* Highlights */}
            {product.info?.length > 0 && (
              <div className="rounded-2xl border border-base-200 p-5">
                <h2 className="mb-3 font-display font-bold">Key Highlights</h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {product.info.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-base-content/80"
                    >
                      <FiCheck className="mt-0.5 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mt-14">
          <h2 className="mb-4 font-display text-2xl font-bold">Description</h2>
          <div className="max-w-4xl space-y-3 leading-relaxed text-base-content/80">
            {paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Q&A */}
        {product.qna?.length > 0 && (
          <div className="mt-14">
            <h2 className="mb-4 font-display text-2xl font-bold">
              Questions &amp; Answers
            </h2>
            <div className="max-w-4xl space-y-3">
              {product.qna.map((item, i) => (
                <details
                  key={i}
                  className="group rounded-2xl border border-base-200 bg-base-100 p-5 open:bg-base-200/50"
                >
                  <summary className="flex cursor-pointer items-center justify-between font-semibold marker:content-none">
                    {item.question}
                    <FiChevronRight className="shrink-0 text-base-content/50 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-base-content/70">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 font-display text-2xl font-bold">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p._index} product={p} index={p._index} />
              ))}
            </div>
          </div>
        )}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </div>
    </RequireLogin>
  );
};

export default ProductDetails;
