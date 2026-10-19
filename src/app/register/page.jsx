import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/Auth/RegisterForm";
import { getAuthStatus } from "@/action/session";
import { buildMetadata } from "@/components/seo/meta";

export const metadata = buildMetadata({
  title: "Register",
  description:
    "Create your Hero Kids account to save your wishlist, track orders and get exclusive deals on safe, creative toys.",
  path: "/register",
});

const RedirectIfAuthed = async () => {
  const user = await getAuthStatus();
  if (user) redirect("/dashboard");
  return null;
};

const RegisterPage = () => (
  <>
    <Suspense fallback={null}>
      <RedirectIfAuthed />
    </Suspense>
    <RegisterForm />
  </>
);

export default RegisterPage;
