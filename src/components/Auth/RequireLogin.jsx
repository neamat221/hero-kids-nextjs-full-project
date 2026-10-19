import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getAuthStatus } from "@/action/session";

const Gate = async ({ children, returnTo }) => {
  await connection();
  const user = await getAuthStatus();
  if (!user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(returnTo)}`);
  }
  return children;
};

const RequireLogin = ({ children, returnTo = "/", fallback = null }) => (
  <Suspense fallback={fallback}>
    <Gate returnTo={returnTo}>{children}</Gate>
  </Suspense>
);

export default RequireLogin;
