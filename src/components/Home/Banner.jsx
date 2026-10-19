import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

const stats = [
  { value: "500+", label: "Happy Kids" },
  { value: "120+", label: "Toys" },
  { value: "4.9", label: "Rating" },
];

const Banner = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-base-200/70 to-base-100">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 animate-blob rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-24 h-80 w-80 animate-blob rounded-full bg-secondary/20 blur-3xl [animation-delay:2s]" />

      <div className="relative max-w-7xl mx-auto grid items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
        {/* Copy */}
        <div className="animate-fade-up space-y-6 text-center md:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            ✨ New Arrivals are here
          </span>

          <h1 className="font-bangla text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            আপনার শিশুকে দিন{" "}
            <span className="text-gradient">সুন্দর দিন</span>
          </h1>

          <p className="mx-auto max-w-xl text-base text-base-content/70 sm:text-lg md:mx-0">
            Discover safe, creative and educational toys that make every
            childhood moment special and every learning moment fun.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row md:items-start md:justify-start">
            <Link
              href="/products"
              className="btn btn-primary btn-lg rounded-full gap-2 shadow-lg shadow-primary/30"
            >
              Shop Now <FiArrowRight />
            </Link>
            <Link
              href="/blog"
              className="btn btn-outline btn-lg rounded-full"
            >
              Explore Blog
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 pt-2 md:justify-start">
            {stats.map((s) => (
              <div key={s.label} className="text-center md:text-left">
                <p className="font-display text-2xl font-bold text-primary">
                  {s.value}
                </p>
                <p className="text-xs text-base-content/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Image */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 m-auto h-72 w-72 rounded-full bg-gradient-to-br from-primary/25 to-secondary/25 blur-2xl sm:h-96 sm:w-96" />
          <div className="relative w-full max-w-lg animate-float-slow">
            <Image
              alt="Hero Kids toys"
              src="/assets/hero.png"
              width={600}
              height={500}
              className="h-auto w-full rounded-3xl object-cover shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
