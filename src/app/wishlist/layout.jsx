import { buildMetadata } from "@/components/seo/meta";

export const metadata = buildMetadata({
  title: "My Wishlist",
  description:
    "Your saved toys and favorites at Hero Kids — move them to the cart whenever you are ready.",
  path: "/wishlist",
});

export default function WishlistLayout({ children }) {
  return children;
}
