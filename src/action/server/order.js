"use server";

import { dbconnect, collection } from "@/lib/dbconnect";

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

export async function createOrder({
  trxId,
  email,
  name,
  phone,
  location,
  items,
  subtotal,
  discount,
  total,
  paymentMethod,
}) {
  const orders = await dbconnect(collection.ORDERS);

  const doc = {
    kind: "order",
    trxId: String(trxId),
    email: normalizeEmail(email),
    name: name ?? null,
    phone: String(phone),
    location: location ?? null,
    items: (items ?? []).map((item) => ({
      id: item.id ?? null,
      title: item.title ?? null,
      bangla: item.bangla ?? null,
      image: item.image ?? null,
      price: Number(item.price) || 0,
      qty: Number(item.qty) || 1,
    })),
    subtotal: Number(subtotal) || 0,
    discount: Number(discount) || 0,
    total: Number(total) || 0,
    paymentMethod: paymentMethod ?? "bkash",
    status: "paid",
    createdAt: new Date(),
  };

  const result = await orders.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function getOrdersByEmail(email) {
  try {
    const orders = await dbconnect(collection.ORDERS);
    return await orders
      .find({ kind: "order", email: normalizeEmail(email) })
      .sort({ createdAt: -1 })
      .toArray();
  } catch {
    return [];
  }
}
