"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { Suspense } from "react";

const NavlinkInner = ({ href, children }) => {
  const path = usePathname();
  const active = href === "/" ? path === "/" : path.startsWith(href);

  return (
    <Link
      href={href}
      className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
        active
          ? "text-primary bg-primary/10"
          : "text-base-content/70 hover:text-primary hover:bg-base-200"
      }`}
    >
      {children}
    </Link>
  );
};

const Navlink = ({ href, children }) => {
  return (
    <Suspense
      fallback={
        <Link
          href={href}
          className="px-4 py-2 rounded-full text-sm font-semibold text-base-content/70"
        >
          {children}
        </Link>
      }
    >
      <NavlinkInner href={href}>{children}</NavlinkInner>
    </Suspense>
  );
};

export default Navlink;
