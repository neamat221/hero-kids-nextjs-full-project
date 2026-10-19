"use server";

import { createUser, findUserByEmail } from "./server/auth";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function registerAction(prevState, formData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirmPassword") || "");

  if (!name || !email || !password) {
    return { error: "Please fill in all fields." };
  }
  if (name.length < 2) {
    return { error: "Please enter your full name." };
  }
  if (!emailPattern.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }
  if (password !== confirm) {
    return { error: "Passwords do not match." };
  }

  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      return { error: "An account with this email already exists." };
    }
    await createUser({ name, email, password });
  } catch (err) {
    console.error("registerAction failed:", err);
    return { error: "Something went wrong. Please try again." };
  }

  return { ok: true };
}
