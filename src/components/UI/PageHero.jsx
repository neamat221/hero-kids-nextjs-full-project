import React from "react";

const PageHero = ({ kicker, title, subtitle, children }) => (
  <section className="page-hero relative overflow-hidden">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 animate-blob rounded-full bg-primary/10 blur-3xl"
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-20 -top-16 h-56 w-56 animate-blob rounded-full bg-secondary/10 blur-3xl"
    />
    <div className="relative mx-auto max-w-7xl px-4 py-14 text-center md:py-16">
      {kicker ? (
        <span className="badge badge-primary badge-outline rounded-full font-semibold uppercase tracking-wide">
          {kicker}
        </span>
      ) : null}
      <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mx-auto mt-3 max-w-2xl text-base-content/60">
          {subtitle}
        </p>
      ) : null}
      {children}
    </div>
  </section>
);

export default PageHero;
