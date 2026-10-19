import { buildMetadata } from "@/components/seo/meta";

export const metadata = buildMetadata({
  title: "Shopping Cart",
  description:
    "Review the toys and games in your Hero Kids cart and continue to secure checkout.",
  path: "/card",
});

export default function CartLayout({ children }) {
  return children;
}
