export default function manifest() {
  return {
    name: "Hero Kids — Toys, Games & Kids Accessories",
    short_name: "Hero Kids",
    description:
      "Discover exciting toys, creative games, and educational products for kids at Hero Kids.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ff6a3d",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any maskable",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
