"use server";

import { dbconnect, collection } from "@/lib/dbconnect";

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

export async function saveContactMessage({ name, email, subject, message }) {
  const trimmed = {
    name: String(name ?? "").trim(),
    email: normalizeEmail(email),
    subject: String(subject ?? "").trim(),
    message: String(message ?? "").trim(),
  };

  if (!trimmed.name || !trimmed.email || !trimmed.subject || !trimmed.message) {
    throw new Error("All fields are required.");
  }

  if (trimmed.name.length > 120 || trimmed.subject.length > 200) {
    throw new Error("Name or subject is too long.");
  }

  if (trimmed.message.length > 5000) {
    throw new Error("Message is too long.");
  }

  const messages = await dbconnect(collection.MESSAGES);
  const doc = {
    kind: "contact",
    ...trimmed,
    status: "new",
    createdAt: new Date(),
  };

  const result = await messages.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}
