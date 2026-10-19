"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authoption";

export async function getAuthStatus() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  return {
    id: session.user.id ?? null,
    name: session.user.name ?? null,
    email: session.user.email,
    role: session.user.role ?? "user",
  };
}
