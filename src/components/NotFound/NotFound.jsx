"use client";

import Link from "next/link";
import { FiHome, FiArrowLeft, FiSearch, FiStar } from "react-icons/fi";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 animate-blob rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 animate-blob rounded-full bg-secondary/20 blur-3xl [animation-delay:2s]" />

      <section className="relative z-10 mx-auto w-full max-w-3xl text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative flex h-32 w-32 items-center justify-center rounded-[2rem] bg-gradient-to-br from-primary to-secondary shadow-2xl shadow-primary/30 sm:h-40 sm:w-40">
            <span className="font-display text-6xl font-black text-primary-content sm:text-7xl">
              404
            </span>
            <FiStar
              size={30}
              className="absolute -right-3 -top-3 animate-pulse fill-current text-accent"
            />
          </div>
        </div>

        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-base-100 px-5 py-2 text-sm font-bold text-primary shadow-sm">
          <FiSearch size={16} /> OOPS! PAGE NOT FOUND
        </p>

        <h1 className="font-display text-4xl font-black tracking-tight sm:text-6xl">
          Lost in the <span className="text-gradient">Toy World?</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-base-content/70 sm:text-lg">
          Looks like this page has gone on an adventure! The page you are
          looking for may have been moved, deleted, or never existed.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="btn btn-primary btn-lg rounded-full gap-3 shadow-lg shadow-primary/30"
          >
            <FiHome size={20} /> Back to Home
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="btn btn-outline btn-lg rounded-full gap-3"
          >
            <FiArrowLeft size={20} /> Go Back
          </button>
        </div>

        <div className="mt-16 rounded-3xl border border-base-200 bg-base-200/50 p-6">
          <p className="font-display text-lg font-bold">
            Ready for another adventure? 🎁
          </p>
          <p className="mt-2 text-sm text-base-content/60">
            Explore our amazing toys and find something wonderful!
          </p>
          <Link
            href="/products"
            className="mt-4 inline-block font-bold text-primary transition-colors hover:text-secondary"
          >
            Explore Products →
          </Link>
        </div>

        <p className="mt-8 text-sm text-base-content/40">
          © 2026 Hero Kids. Keep smiling!
        </p>
      </section>
    </main>
  );
}
