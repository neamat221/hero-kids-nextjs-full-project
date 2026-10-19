const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://hero-kids-sigma.vercel.app";

export const siteUrl = rawSiteUrl.replace(/\/+$/, "");

export const siteName = "Hero Kids";

const absolute = (url) =>
  /^https?:\/\//i.test(String(url)) ? String(url) : new URL(url, siteUrl).toString();

export const ogImage = {
  url: absolute("/opengraph-image"),
  width: 1200,
  height: 630,
  alt: "Hero Kids — Toys, Games & Kids Accessories",
};

export const twitterImage = {
  url: absolute("/twitter-image"),
  width: 1200,
  height: 630,
  alt: "Hero Kids — Toys, Games & Kids Accessories",
};

export function buildMetadata({
  title,
  description,
  path = "/",
  type = "website",
  images,
  extraOpenGraph = {},
}) {
  const ogImages = (
    images?.length ? images : [ogImage]
  ).map((img) => ({
    ...(typeof img === "string" ? { url: img } : img),
    url: absolute(img?.url ?? img),
  }));

  const url = absolute(path);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      siteName,
      locale: "en_US",
      type,
      images: ogImages,
      ...extraOpenGraph,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map((img) => img.url),
    },
  };
}
