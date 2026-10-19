import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import LoginForm from "@/components/Auth/LoginForm";
import { getAuthStatus } from "@/action/session";
import { googleEnabled } from "@/lib/authoption";
import { buildMetadata } from "@/components/seo/meta";

export const metadata = buildMetadata({
  title: "Login",
  description:
    "Log in to your Hero Kids account to track orders, save your wishlist and enjoy exclusive deals on toys.",
  path: "/login",
});

const RedirectIfAuthed = async () => {
  const user = await getAuthStatus();
  if (user) redirect("/dashboard");
  return null;
};

const LoginPage = () => (
  <>
    <Suspense fallback={null}>
      <RedirectIfAuthed />
    </Suspense>
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      }
    >
      <LoginForm showGoogle={googleEnabled} />
    </Suspense>
  </>
);

export default LoginPage;

