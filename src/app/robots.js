export default function robots() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://hero-kids-sigma.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard",
          "/checkout",
          "/card",
          "/wishlist",
          "/login",
          "/register",
        ],
      },
    ],
    sitemap: `${siteUrl.replace(/\/+$/, "")}/sitemap.xml`,
    host: siteUrl.replace(/\/+$/, ""),
  };
}
