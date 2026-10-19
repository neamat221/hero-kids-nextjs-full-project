import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href={"/"} className="group flex items-center gap-2">
      <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-md ring-1 ring-black/5 transition-transform group-hover:scale-105">
        <Image
          alt="Hero Kids logo"
          src={"/assets/hero.png"}
          width={40}
          height={40}
          className="h-10 w-10 object-cover"
        />
      </span>
      <span className="font-display text-xl font-bold leading-none tracking-tight">
        Hero <span className="text-gradient">Kids</span>
      </span>
    </Link>
  );
};

export default Logo;
