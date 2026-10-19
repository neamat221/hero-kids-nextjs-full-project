import React from "react";
import RequireLogin from "@/components/Auth/RequireLogin";
import BkashCheckout from "@/components/Checkout/BkashCheckout";
import { buildMetadata } from "@/components/seo/meta";

export const metadata = buildMetadata({
  title: "Checkout with bKash",
  description:
    "Complete your Hero Kids order securely with bKash mobile payment.",
  path: "/checkout/bkash",
});

const BkashCheckoutPage = () => (
  <RequireLogin
    returnTo="/checkout/bkash"
    fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    }
  >
    <BkashCheckout />
  </RequireLogin>
);

export default BkashCheckoutPage;
