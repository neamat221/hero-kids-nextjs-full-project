import Link from "next/link";
import { Suspense } from "react";
import Banner from "@/components/Home/Banner";
import Products from "@/components/Home/Products";
import NewsletterForm from "@/components/UI/NewsletterForm";
import {
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiHeadphones,
} from "react-icons/fi";

export const metadata = {
  alternates: { canonical: "/" },
};

const features = [
  {
    icon: FiTruck,
    title: "Free Delivery",
    text: "On all orders over ৳2000",
  },
  { icon: FiShield, title: "Safe Materials", text: "Non-toxic & child-safe" },
  { icon: FiRefreshCw, title: "Easy Returns", text: "7-day return policy" },
  { icon: FiHeadphones, title: "Support 24/7", text: "We're always here" },
];

const categories = [
  { emoji: "🧩", title: "Educational", text: "Learn while playing" },
  { emoji: "🧱", title: "STEM & Building", text: "Build & create" },
  { emoji: "🦸", title: "Costumes", text: "Role-play fun" },
  { emoji: "⚽", title: "Outdoor", text: "Active & healthy" },
];

export default function Home() {
  return (
    <div>
      <Banner />

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 pt-12">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-base-200 bg-base-200 shadow-lg sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group flex items-center gap-3 bg-base-100 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-base-100/80"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                <Icon size={24} />
              </span>
              <div className="min-w-0">
                <p className="font-display text-sm font-bold leading-tight">
                  {title}
                </p>
                <p className="mt-0.5 text-xs leading-tight text-base-content/60">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-10 text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-primary">
            Browse
          </span>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Shop by Category
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.title}
              href="/products"
              className="group rounded-3xl border border-base-200 bg-gradient-to-br from-base-200/60 to-base-100 p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl"
            >
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-base-100 text-3xl shadow-sm transition-transform group-hover:scale-110">
                {c.emoji}
              </span>
              <h3 className="mt-4 font-display font-bold">{c.title}</h3>
              <p className="text-xs text-base-content/60">{c.text}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        }
      >
        <Products />
      </Suspense>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 pb-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-secondary to-primary px-6 py-12 text-center text-primary-content md:px-16 md:py-16">
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -right-8 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative mx-auto max-w-2xl space-y-5">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Get 15% OFF Your First Order
            </h2>
            <p className="text-primary-content/90">
              Join the Hero Kids family and give your child the gift of joyful
              learning. Subscribe for exclusive offers and new arrivals.
            </p>
          <div className="mx-auto mt-8 flex max-w-md justify-center">
            <NewsletterForm variant="cta" />
          </div>
          </div>
        </div>
      </section>
    </div>
  );
}
