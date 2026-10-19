"use client";

import ErrorState from "@/components/Error/ErrorState";

export default function Error({ error, reset }) {
  return <ErrorState error={error} reset={reset} />;
}
