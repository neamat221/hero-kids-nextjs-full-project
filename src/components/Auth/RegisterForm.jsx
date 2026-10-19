"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiUser,
  FiUserPlus,
} from "react-icons/fi";
import AuthShell from "./AuthShell";
import { registerAction } from "@/action/auth";

const RegisterForm = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPending(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const result = await registerAction(null, form);

    if (result?.error) {
      setPending(false);
      setError(result.error);
      return;
    }

    const login = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    setPending(false);

    if (login?.error) {
      setError("Account created, but auto-login failed. Please log in.");
      router.push("/login");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Sign up in seconds and start shopping the fun way."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="link link-primary font-semibold">
            Log in
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
          <label htmlFor="name" className="mb-2 block text-sm font-semibold">
            Full Name
          </label>
          <label className="input input-bordered flex w-full items-center gap-2 rounded-2xl bg-base-200/60">
            <FiUser className="text-base-content/50" />
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              autoComplete="name"
              required
              className="grow"
            />
          </label>
        </div>

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
              placeholder="At least 6 characters"
              autoComplete="new-password"
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

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-semibold"
          >
            Confirm Password
          </label>
          <label className="input input-bordered flex w-full items-center gap-2 rounded-2xl bg-base-200/60">
            <FiLock className="text-base-content/50" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              required
              className="grow"
            />
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
            <FiUserPlus />
          )}
          {pending ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </AuthShell>
  );
};

export default RegisterForm;
