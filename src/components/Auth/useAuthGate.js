"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { getAuthStatus } from "@/action/session";

// Resolves the login state once (then caches it) and blocks the action with a
// redirect to /login when the visitor is not signed in.
export function useAuthGate() {
  const router = useRouter();
  const statusRef = useRef(null);

  const ensureLoggedIn = async () => {
    if (statusRef.current === null) {
      try {
        statusRef.current = (await getAuthStatus()) ? "in" : "out";
      } catch {
        statusRef.current = "out";
      }
    }

    if (statusRef.current === "in") return true;

    router.push("/login");
    return false;
  };

  return { ensureLoggedIn };
}
