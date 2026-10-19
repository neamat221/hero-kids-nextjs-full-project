"use client";

import React, { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import Navlink from "../Button/Navlink";
import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiSearch,
  FiHeart,
  FiUser,
} from "react-icons/fi";
import { useCart } from "../Cart/CartContext";
import { useWishlist } from "../Wishlist/WishlistContext";
import { useSession, signOut } from "next-auth/react";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const tickerItems = [
  "🎉 Free delivery on orders over ৳2000",
  "✨ Enjoy 15% OFF your first order",
  "🎁 New arrivals every week",
  "🛡️ 100% safe & non-toxic materials",
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  const { count } = useCart();
  const { count: wishCount } = useWishlist();

  const user = session?.user ?? null;
  const loading = status === "loading";

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <>
      {/* Announcement ticker */}
      <div className="overflow-hidden bg-gradient-to-r from-primary via-secondary to-primary text-primary-content">
        <div className="flex w-max animate-ticker py-2">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 items-center gap-12 pr-12 text-xs font-medium tracking-wide sm:text-sm"
            >
              {tickerItems.map((item) => (
                <li key={item} className="whitespace-nowrap">
                  {item}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-50 glass border-b border-base-300/70 shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_8px_24px_-16px_rgba(0,0,0,0.15)]">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4">
          {/* Left */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="btn btn-ghost btn-circle md:hidden"
            >
              {open ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
            <Logo />
          </div>

          {/* Center */}
          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Navlink href={l.href}>{l.label}</Navlink>
              </li>
            ))}
          </ul>

          {/* Right */}
          <div className="flex items-center gap-1">
            <Link
              href="/products"
              aria-label="Search products"
              className="btn btn-ghost btn-circle hidden sm:inline-flex"
            >
              <FiSearch size={20} />
            </Link>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="btn btn-ghost btn-circle hidden sm:inline-flex"
            >
              <div className="indicator">
                {wishCount > 0 ? (
                  <span className="indicator-item badge badge-primary badge-xs">
                    {wishCount}
                  </span>
                ) : null}
                <FiHeart size={20} />
              </div>
            </Link>
            <Link
              href="/card"
              aria-label="Cart"
              className="btn btn-ghost btn-circle"
            >
              <div className="indicator">
                {count > 0 ? (
                  <span className="indicator-item badge badge-primary badge-xs">
                    {count}
                  </span>
                ) : null}
                <FiShoppingCart size={20} />
              </div>
            </Link>
            <Link
              href="/dashboard"
              aria-label="Dashboard"
              className="btn btn-ghost btn-circle hidden sm:inline-flex"
            >
              <FiUser size={20} />
            </Link>
            {loading ? (
              <span className="hidden h-8 w-20 items-center justify-center sm:inline-flex">
                <span className="loading loading-spinner loading-xs" />
              </span>
            ) : user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-primary btn-sm hidden rounded-full sm:inline-flex"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="btn btn-primary btn-sm hidden rounded-full sm:inline-flex"
              >
                Login
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          className={`overflow-hidden border-t border-base-300/70 transition-[max-height,opacity] duration-300 md:hidden ${
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="menu w-full gap-1 px-3 py-3">
            {links.map((l) => (
              <li key={l.href} onClick={() => setOpen(false)}>
                <Navlink href={l.href}>{l.label}</Navlink>
              </li>
            ))}
            <li className="mt-1 grid grid-cols-2 gap-2">
              <Link
                href="/wishlist"
                onClick={() => setOpen(false)}
                className="btn btn-outline rounded-full gap-2"
              >
                <FiHeart size={16} /> Wishlist
                {wishCount > 0 ? ` (${wishCount})` : ""}
              </Link>
              <Link
                href="/card"
                onClick={() => setOpen(false)}
                className="btn btn-outline rounded-full gap-2"
              >
                <FiShoppingCart size={16} /> Cart
                {count > 0 ? ` (${count})` : ""}
              </Link>
            </li>
            <li className="mt-2 flex flex-col gap-2">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="btn btn-outline rounded-full"
              >
                Dashboard
              </Link>
              {loading ? (
                <span className="flex h-9 items-center justify-center">
                  <span className="loading loading-spinner loading-xs" />
                </span>
              ) : user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-primary w-full rounded-full"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="btn btn-primary rounded-full"
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      </header>
    </>
  );
};

export default Navbar;
