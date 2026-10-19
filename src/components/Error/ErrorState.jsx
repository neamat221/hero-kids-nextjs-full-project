"use client";

import Link from "next/link";
import { FiAlertTriangle, FiRefreshCw, FiHome } from "react-icons/fi";

export default function ErrorState({ error, reset }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-error/10 text-error">
          <FiAlertTriangle size={38} />
        </div>
        <h2 className="font-display text-2xl font-bold">
          Something went wrong
        </h2>
        <p className="mt-3 text-base-content/70">
          {error?.message || "Failed to load data. Please try again."}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => reset()}
            className="btn btn-primary rounded-full gap-2"
          >
            <FiRefreshCw /> Try again
          </button>
          <Link href="/" className="btn btn-outline rounded-full gap-2">
            <FiHome /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
