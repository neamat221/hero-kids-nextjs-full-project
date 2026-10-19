import React from "react";
import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "@/components/UI/NewsletterForm";
import {
  FiFacebook,
  FiInstagram,
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const categories = [
  "Educational Toys",
  "STEM & Building",
  "Role-play Costumes",
  "Outdoor & Active",
  "Art & Creative",
];

const Footer = () => {
  return (
    <footer className="mt-16 bg-neutral text-neutral-content">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-secondary">
                <Image
                  src="/assets/hero.png"
                  alt="Hero Kids logo"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-cover"
                />
              </span>
              <span className="font-display text-xl font-bold">Hero Kids</span>
            </Link>
            <p className="text-sm leading-relaxed text-neutral-content/70">
              Bringing joy to childhood with safe, colorful and educational toys
              your little ones will love.
            </p>
            <div className="flex gap-2 pt-1">
              {[
                { icon: FiFacebook, label: "Facebook" },
                { icon: FiInstagram, label: "Instagram" },
                { icon: FiYoutube, label: "YouTube" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="btn btn-sm btn-circle bg-white/10 border-0 text-neutral-content hover:bg-primary hover:text-primary-content"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="footer-title font-display text-base">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-neutral-content/70 transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="footer-title font-display text-base">Categories</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    href="/products"
                    className="text-neutral-content/70 transition-colors hover:text-primary"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + newsletter */}
          <div className="space-y-4">
            <h3 className="footer-title font-display text-base">Stay in Touch</h3>
            <ul className="space-y-2 text-sm text-neutral-content/70">
              <li className="flex items-center gap-2">
                <FiMail className="text-primary" /> support@herokids.com
              </li>
              <li className="flex items-center gap-2">
                <FiPhone className="text-primary" /> +880 1700-000000
              </li>
              <li className="flex items-center gap-2">
                <FiMapPin className="text-primary" /> Dhaka, Bangladesh
              </li>
            </ul>

            <NewsletterForm variant="footer" />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-neutral-content/60 sm:flex-row">
          <p>© 2026 Hero Kids. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="#" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
