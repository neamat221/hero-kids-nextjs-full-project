"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiMapPin, FiUser, FiPhone, FiMail, FiArrowRight } from "react-icons/fi";
import { getAuthStatus } from "@/action/session";

export const CHECKOUT_DETAILS_KEY = "hero-kids-checkout-details";

const CheckoutDetails = () => {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", location: "", phone: "", email: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const saved = JSON.parse(localStorage.getItem(CHECKOUT_DETAILS_KEY) || "null");
        const user = await getAuthStatus();
        setForm((prev) => ({
          name: saved?.name || user?.name || "",
          location: saved?.location || "",
          phone: saved?.phone || "",
          email: saved?.email || user?.email || "",
        }));
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.location.trim()) next.location = "Location is required.";
    if (!/^01[3-9]\d{8}$/.test(form.phone.trim()))
      next.phone = "Enter a valid phone (e.g. 017XXXXXXXX).";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      next.email = "Enter a valid email address.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    localStorage.setItem(
      CHECKOUT_DETAILS_KEY,
      JSON.stringify({
        name: form.name.trim(),
        location: form.location.trim(),
        phone: form.phone.trim(),
        email: form.email.trim().toLowerCase(),
      })
    );
    router.push("/checkout/bkash");
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  const field = (name, label, Icon, type = "text", placeholder = "") => (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-semibold">
        {label}
      </label>
      <div className="input input-bordered flex items-center gap-2 rounded-2xl bg-base-200/60 px-4 focus-within:border-primary">
        <Icon className="shrink-0 text-base-content/40" size={18} />
        <input
          id={name}
          name={name}
          type={type}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none"
          autoComplete="off"
        />
      </div>
      {errors[name] && (
        <p className="mt-1 text-xs text-error">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="font-display text-3xl font-bold">Checkout Details</h1>
      <p className="mt-2 text-sm text-base-content/60">
        Fill in your details to continue to bKash payment.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5 rounded-3xl border border-base-200 p-6 shadow-xl"
      >
        {field("name", "Name", FiUser, "text", "Your full name")}
        {field("location", "Location", FiMapPin, "text", "Delivery address / area")}
        {field("phone", "Phone", FiPhone, "tel", "017XXXXXXXX")}
        {field("email", "Email", FiMail, "email", "you@example.com")}
        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary btn-lg w-full rounded-full gap-2 shadow-lg shadow-primary/30"
        >
          Continue to bKash <FiArrowRight />
        </button>
      </form>
    </div>
  );
};

export default CheckoutDetails;
