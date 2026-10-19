"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiLogIn,
  FiMail,
  FiChrome,
} from "react-icons/fi";
import AuthShell from "./AuthShell";

const safeCallback = (value) =>
  value && value.startsWith("/") && !value.startsWith("//")
    ? value
    : "/dashboard";

const LoginForm = ({ showGoogle = false }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = safeCallback(searchParams.get("callbackUrl"));
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPending(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    setPending(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  const handleGoogle = async () => {
    setGooglePending(true);
    await signIn("google", { callbackUrl });
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to your Hero Kids account to continue."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="link link-primary font-semibold">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error ? (
          <p role="alert" className="alert alert-error rounded-2xl text-sm">
            {error}
          </p>
        ) : null}

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold">
            Email Address
          </label>
          <label className="input input-bordered flex w-full items-center gap-2 rounded-2xl bg-base-200/60">
            <FiMail className="text-base-content/50" />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="grow"
            />
          </label>
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-semibold">
            Password
          </label>
          <label className="input input-bordered flex w-full items-center gap-2 rounded-2xl bg-base-200/60">
            <FiLock className="text-base-content/50" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="grow"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
              className="text-base-content/50 hover:text-primary"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </label>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="btn btn-primary btn-lg w-full rounded-full gap-2 shadow-lg shadow-primary/30"
        >
          {pending ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <FiLogIn />
          )}
          {pending ? "Logging in..." : "Login"}
        </button>

        {showGoogle ? (
          <>
            <div className="divider text-xs text-base-content/50">or</div>
            <button
              type="button"
              onClick={handleGoogle}
              disabled={googlePending}
              className="btn btn-outline btn-lg w-full rounded-full gap-2"
            >
              {googlePending ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <FiChrome />
              )}
              Continue with Google
            </button>
          </>
        ) : null}
      </form>
    </AuthShell>
  );
};

export default LoginForm;
