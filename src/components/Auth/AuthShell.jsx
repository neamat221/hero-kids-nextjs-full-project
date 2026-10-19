import React from "react";
import Link from "next/link";
import { FiGift, FiTruck, FiShield, FiStar } from "react-icons/fi";

const perks = [
  { icon: FiTruck, label: "Free delivery over ৳2000" },
  { icon: FiGift, label: "15% OFF your first order" },
  { icon: FiShield, label: "100% non-toxic & safe toys" },
  { icon: FiStar, label: "Loved by 500+ happy kids" },
];

const AuthShell = ({ title, subtitle, children, footer }) => {
  return (
    <section className="page-hero relative overflow-hidden">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
        {/* Promo */}
        <div className="relative hidden overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-secondary to-primary p-10 text-primary-content shadow-2xl md:block">
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <span className="badge border-0 bg-white/20 text-primary-content">
              Hero Kids Club
            </span>
            <h2 className="mt-5 font-display text-4xl font-bold leading-tight">
              Join the fun and unlock rewards!
            </h2>
            <p className="mt-4 leading-relaxed text-primary-content/90">
              Create an account to save your wishlist, track orders and get
              exclusive deals on every toy.
            </p>

            <ul className="mt-8 space-y-4">
              {perks.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/20">
                    <Icon size={18} />
                  </span>
                  <span className="text-sm font-medium">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Form */}
        <div className="mx-auto w-full max-w-md rounded-3xl border border-base-200 bg-base-100 p-6 shadow-xl sm:p-10">
          <h1 className="font-display text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-base-content/60">{subtitle}</p>

          <div className="mt-8">{children}</div>

          {footer ? (
            <p className="mt-6 text-center text-sm text-base-content/70">
              {footer}
            </p>
          ) : null}

          <p className="mt-6 text-center text-xs text-base-content/50">
            By continuing you agree to our{" "}
            <Link href="/" className="link link-primary">
              Terms
            </Link>{" "}
            &amp;{" "}
            <Link href="/" className="link link-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
};

export default AuthShell;
