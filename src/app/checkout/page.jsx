import React from "react";
import RequireLogin from "@/components/Auth/RequireLogin";
import CheckoutDetails from "@/components/Checkout/CheckoutDetails";
import { buildMetadata } from "@/components/seo/meta";

export const metadata = buildMetadata({
  title: "Checkout Details",
  description:
    "Enter your name, location, phone and email to continue your Hero Kids order.",
  path: "/checkout",
});

const CheckoutPage = () => (
  <RequireLogin
    returnTo="/checkout"
    fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    }
  >
    <CheckoutDetails />
  </RequireLogin>
);

export default CheckoutPage;
