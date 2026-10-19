import products from "@/data/toys.json";
import blogs from "@/data/blogs";
import { siteUrl } from "@/components/seo/meta";

export default function sitemap() {
  const now = new Date();

  const staticRoutes = [
    { url: `${siteUrl}/`, priority: 1, changeFrequency: "weekly" },
    { url: `${siteUrl}/products`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${siteUrl}/blog`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${siteUrl}/contact`, priority: 0.6, changeFrequency: "monthly" },
  ];

  const productRoutes = products.map((_, i) => ({
    url: `${siteUrl}/products/${i}`,
    priority: 0.7,
    changeFrequency: "weekly",
  }));

  const blogRoutes = blogs.map((b) => ({
    url: `${siteUrl}/blog/${b.slug}`,
    priority: 0.6,
    changeFrequency: "monthly",
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes].map((route) => ({
    ...route,
    lastModified: now,
  }));
}
