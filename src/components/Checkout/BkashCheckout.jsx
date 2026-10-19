"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";
import {
  FiChevronLeft,
  FiCheckCircle,
  FiShoppingBag,
  FiCreditCard,
  FiDownload,
  FiMapPin,
} from "react-icons/fi";
import { useCart } from "@/components/Cart/CartContext";
import { CHECKOUT_DETAILS_KEY } from "@/components/Checkout/CheckoutDetails";
import { createOrder } from "@/action/server/order";

const FREE_DISCOUNT_MIN = 2000;
const DISCOUNT_RATE = 0.15;

const STEPS = ["phone", "otp", "pin", "confirm"];

const stepIndex = (step) =>
  step === "success" ? STEPS.length : STEPS.indexOf(step);

const BkashLogo = ({ size = "text-2xl" }) => (
  <span
    className={`font-display font-extrabold tracking-tight text-white ${size}`}
  >
    bKash
  </span>
);

const BkashCheckout = () => {
  const router = useRouter();
  const { items, count, subtotal, clearCart, ready } = useCart();

  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [trxId, setTrxId] = useState("");
  const [paidTotal, setPaidTotal] = useState(0);
  const [receipt, setReceipt] = useState(null);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem(CHECKOUT_DETAILS_KEY) || "null");
    } catch {
      saved = null;
    }
    if (!saved?.name || !saved?.location || !saved?.phone || !saved?.email) {
      router.replace("/checkout");
      return;
    }
    queueMicrotask(() => {
      setDetails(saved);
      setPhone(saved.phone);
    });
  }, [router]);

  const discount =
    subtotal >= FREE_DISCOUNT_MIN ? Math.round(subtotal * DISCOUNT_RATE) : 0;
  const total = subtotal - discount;

  if (!ready || !details) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (items.length === 0 && step !== "success") {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <FiShoppingBag className="mx-auto text-base-content/30" size={48} />
        <p className="mt-4 font-display text-xl font-bold">
          Your cart is empty
        </p>
        <p className="mt-1 text-sm text-base-content/60">
          Add some toys before checking out.
        </p>
        <Link href="/products" className="btn btn-primary mt-6 rounded-full">
          Browse Products
        </Link>
      </div>
    );
  }

  const withDelay = (fn, ms = 900) => {
    setProcessing(true);
    setError("");
    window.setTimeout(() => {
      fn();
      setProcessing(false);
    }, ms);
  };

  const handlePhone = () => {
    if (!/^01[3-9]\d{8}$/.test(phone.trim())) {
      setError("Enter a valid bKash number (e.g. 017XXXXXXXX).");
      return;
    }
    withDelay(() => setStep("otp"));
  };

  const handleOtp = () => {
    if (!/^\d{4}$/.test(otp.trim())) {
      setError("Enter the 4-digit verification code.");
      return;
    }
    withDelay(() => setStep("pin"));
  };

  const handlePin = () => {
    if (!/^\d{5}$/.test(pin.trim())) {
      setError("Enter your 5-digit bKash PIN.");
      return;
    }
    withDelay(() => setStep("confirm"));
  };

  const handlePay = () => {
    if (!details) return;
    setProcessing(true);
    setError("");
    window.setTimeout(async () => {
      try {
        const newTrxId = `HC${Date.now().toString().slice(-10)}`;

        await createOrder({
          trxId: newTrxId,
          email: details.email,
          name: details.name,
          phone: details.phone,
          location: details.location,
          items,
          subtotal,
          discount,
          total,
          paymentMethod: "bkash",
        });

        setTrxId(newTrxId);
        setPaidTotal(total);
        setReceipt({
          trxId: newTrxId,
          phone: details.phone,
          name: details.name,
          email: details.email,
          location: details.location,
          items: items.map((item) => ({ ...item })),
          count,
          subtotal,
          discount,
          total,
          paidAt: new Date(),
        });
        clearCart();
        setStep("success");
      } catch {
        setError("Payment could not be saved. Please try again.");
      } finally {
        setProcessing(false);
      }
    }, 1400);
  };

  const handleDownloadReceipt = () => {
    if (!receipt) return;

    // jsPDF standard fonts have no glyphs for ৳ or Bengali script,
    // so the PDF uses "Tk" and English text only.
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 18;
    let y = 0;

    doc.setFillColor(226, 19, 110);
    doc.rect(0, 0, pageW, 34, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("bKash", margin, 16);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Payment Receipt", margin, 24);
    doc.setFontSize(9);
    doc.text("Hero Kids - Toys, Games & Kids Accessories", pageW - margin, 16, {
      align: "right",
    });
    doc.text("hero-kids-sigma.vercel.app", pageW - margin, 21, {
      align: "right",
    });

    y = 48;
    doc.setTextColor(30, 30, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Transaction Details", margin, y);

    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const details = [
      ["Transaction ID", receipt.trxId],
      ["Status", "PAID (Completed)"],
      ["Date", receipt.paidAt.toLocaleString("en-GB")],
      ["Payment method", "bKash"],
      ["Paid from", `+880 ${receipt.phone}`],
      ["Customer", receipt.name || "-"],
      ["Email", receipt.email || "-"],
      ["Location", receipt.location || "-"],
    ];
    for (const [label, value] of details) {
      doc.setTextColor(110, 110, 110);
      doc.text(label, margin, y);
      doc.setTextColor(30, 30, 30);
      doc.setFont("helvetica", "bold");
      doc.text(String(value), margin + 50, y);
      doc.setFont("helvetica", "normal");
      y += 6;
    }

    y += 6;
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, y, pageW - margin, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Items", margin, y);
    y += 8;

    doc.setFontSize(9);
    doc.setTextColor(110, 110, 110);
    doc.text("ITEM", margin, y);
    doc.text("QTY", pageW - margin - 40, y, { align: "right" });
    doc.text("UNIT", pageW - margin - 22, y, { align: "right" });
    doc.text("AMOUNT", pageW - margin, y, { align: "right" });
    y += 4;
    doc.line(margin, y, pageW - margin, y);
    y += 6;

    doc.setTextColor(30, 30, 30);
    for (const item of receipt.items) {
      const title = String(item.title || "").slice(0, 44);
      doc.setFont("helvetica", "normal");
      doc.text(title, margin, y);
      doc.text(String(item.qty), pageW - margin - 40, y, { align: "right" });
      doc.text(`Tk ${item.price}`, pageW - margin - 22, y, { align: "right" });
      doc.text(`Tk ${item.price * item.qty}`, pageW - margin, y, {
        align: "right",
      });
      y += 6;
      if (y > 265) {
        doc.addPage();
        y = 20;
      }
    }

    y += 2;
    doc.line(margin, y, pageW - margin, y);
    y += 8;

    const summary = [
      ["Subtotal", `Tk ${receipt.subtotal}`],
      ...(receipt.discount > 0
        ? [["Discount (15%)", `-Tk ${receipt.discount}`]]
        : []),
    ];
    for (const [label, value] of summary) {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(110, 110, 110);
      doc.text(label, pageW - margin - 50, y);
      doc.setTextColor(30, 30, 30);
      doc.text(value, pageW - margin, y, { align: "right" });
      y += 6;
    }

    doc.setFillColor(226, 19, 110);
    doc.roundedRect(margin, y, pageW - margin * 2, 14, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Total Paid", margin + 5, y + 9);
    doc.text(`Tk ${receipt.total}`, pageW - margin - 5, y + 9, {
      align: "right",
    });
    y += 24;

    doc.setTextColor(140, 140, 140);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      "This is a simulated demo checkout - no real payment was processed.",
      pageW / 2,
      y,
      { align: "center" },
    );
    y += 5;
    doc.text(
      `Receipt generated on ${new Date().toLocaleString("en-GB")}`,
      pageW / 2,
      y,
      { align: "center" },
    );

    doc.save(`hero-kids-receipt-${receipt.trxId}.pdf`);
  };

  const shell = (title, children) => (
    <div className="mx-auto w-full max-w-md">
      <div className="overflow-hidden rounded-3xl border border-base-200 shadow-xl">
        <div className="flex items-center gap-3 bg-[#e2136e] px-5 py-4">
          <button
            type="button"
            aria-label="Back to cart"
            onClick={() => router.push("/card")}
            className="text-white/90 transition hover:text-white"
          >
            <FiChevronLeft size={22} />
          </button>
          <BkashLogo />
          <span className="ml-auto rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
            ৳{total}
          </span>
        </div>

        <div className="bg-[#fdf0f5] px-5 py-3">
          <ul className="steps steps-horizontal w-full text-xs">
            {STEPS.map((s, i) => (
              <li
                key={s}
                className={`step ${stepIndex(step) >= i ? "step-primary" : ""}`}
                data-content={stepIndex(step) > i ? "✓" : i + 1}
              >
                {s === "phone"
                  ? "Number"
                  : s === "otp"
                    ? "Verify"
                    : s === "pin"
                      ? "PIN"
                      : "Confirm"}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white px-6 py-7">
          <h1 className="mb-1 font-display text-xl font-bold">{title}</h1>
          {children}
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-base-content/50">
        Demo checkout — no real payment is processed.
      </p>
    </div>
  );

  const errorBox = error ? (
    <p
      role="alert"
      className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600"
    >
      {error}
    </p>
  ) : null;

  const primaryBtn = (label, onClick) => (
    <button
      type="button"
      onClick={onClick}
      disabled={processing}
      className="btn mt-6 w-full rounded-full border-0 bg-[#e2136e] text-white hover:bg-[#c10f5d]"
    >
      {processing ? (
        <span className="loading loading-spinner loading-sm" />
      ) : (
        label
      )}
    </button>
  );

  if (step === "phone") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        {shell(
          "Pay with bKash",
          <>
            <p className="mb-5 text-sm text-base-content/70">
              Enter your bKash account number to pay <strong>৳{total}</strong>{" "}
              for {count} item{count > 1 ? "s" : ""}.
            </p>
            <label className="input input-bordered flex w-full items-center gap-2 rounded-2xl">
              <span className="text-sm font-semibold text-base-content/60">
                +880
              </span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={11}
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))
                }
                placeholder="017XXXXXXXX"
                className="grow"
                autoFocus
              />
            </label>
            {errorBox}
            {primaryBtn("Continue", handlePhone)}
          </>,
        )}
      </div>
    );
  }

  if (step === "otp") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        {shell(
          "Verification code",
          <>
            <p className="mb-5 text-sm text-base-content/70">
              We sent a 4-digit code to <strong>+880 {phone}</strong>. Enter{" "}
              <strong>1234</strong> to continue (demo code).
            </p>
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              placeholder="••••"
              className="input input-bordered w-full rounded-2xl text-center font-mono text-2xl tracking-[0.6em]"
              autoFocus
            />
            {errorBox}
            {primaryBtn("Verify", handleOtp)}
          </>,
        )}
      </div>
    );
  }

  if (step === "pin") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        {shell(
          "Enter bKash PIN",
          <>
            <p className="mb-5 text-sm text-base-content/70">
              Enter your 5-digit bKash PIN to authorize the payment of{" "}
              <strong>৳{total}</strong>. Use any 5 digits (demo).
            </p>
            <input
              type="password"
              inputMode="numeric"
              maxLength={5}
              value={pin}
              onChange={(e) =>
                setPin(e.target.value.replace(/\D/g, "").slice(0, 5))
              }
              placeholder="•••••"
              className="input input-bordered w-full rounded-2xl text-center font-mono text-2xl tracking-[0.5em]"
              autoFocus
            />
            {errorBox}
            {primaryBtn("Confirm Payment", handlePin)}
          </>,
        )}
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        {shell(
          "Confirm payment",
          <>
            <div className="space-y-2 rounded-2xl bg-base-200/60 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-base-content/60">Merchant</span>
                <span className="font-semibold">Hero Kids</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/60">bKash number</span>
                <span className="font-semibold">+880 {phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/60">Items</span>
                <span className="font-semibold">{count}</span>
              </div>
              {discount > 0 ? (
                <div className="flex justify-between text-success">
                  <span>Discount (15%)</span>
                  <span>-৳{discount}</span>
                </div>
              ) : null}
              <div className="flex justify-between border-t border-base-300 pt-2">
                <span className="font-semibold">Total</span>
                <span className="font-display text-lg font-bold text-[#e2136e]">
                  ৳{total}
                </span>
              </div>
            </div>
            {errorBox}
            {primaryBtn(`Pay ৳${total}`, handlePay)}
            <button
              type="button"
              onClick={() => router.push("/card")}
              className="btn btn-ghost mt-2 w-full rounded-full"
            >
              Cancel
            </button>
          </>,
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-base-200 shadow-xl">
        <div className="flex items-center justify-center gap-3 bg-[#e2136e] px-5 py-4">
          <BkashLogo />
        </div>
        <div className="bg-white px-6 py-10 text-center">
          <FiCheckCircle className="mx-auto text-[#e2136e]" size={56} />
          <h1 className="mt-4 font-display text-2xl font-bold">
            Payment successful!
          </h1>
          <p className="mt-2 text-sm text-base-content/70">
            ৳{paidTotal} paid to Hero Kids from +880 {phone}.
          </p>
          <div className="mt-5 space-y-1 rounded-2xl bg-base-200/60 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-base-content/60">Transaction ID</span>
              <span className="font-mono font-semibold">{trxId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/60">Status</span>
              <span className="font-semibold text-success">Completed</span>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-base-200 p-4 text-left">
            <div className="flex items-center gap-2 font-semibold">
              <FiMapPin className="text-[#e2136e]" size={18} />
              Delivery Location
            </div>
            <p className="mt-2 text-sm text-base-content/70">
              Deliver to: <strong>{receipt?.location || details?.location}</strong>
            </p>
            <p className="mt-1 text-xs text-base-content/50">
              Estimated delivery: 2–5 business days
            </p>
            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(receipt?.location || details?.location || "Dhaka, Bangladesh")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm mt-2 gap-2 px-0 text-[#e2136e] hover:bg-transparent hover:text-[#e2136e]"
            >
              <FiMapPin /> View on Google Maps
            </a>
          </div>
          <button
            type="button"
            onClick={handleDownloadReceipt}
            disabled={!receipt}
            className="btn btn-outline btn-lg mt-5 w-full rounded-full gap-2 border-[#e2136e] text-[#e2136e] hover:border-[#e2136e] hover:bg-[#e2136e] hover:text-white"
          >
            <FiDownload /> Download PDF Receipt
          </button>
          <Link
            href="/products"
            className="btn btn-primary mt-3 w-full rounded-full gap-2"
          >
            <FiShoppingBag /> Continue Shopping
          </Link>
          <Link
            href="/dashboard"
            className="btn btn-ghost mt-2 w-full rounded-full gap-2"
          >
            <FiCreditCard /> Go to Dashboard
          </Link>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-base-content/50">
        Demo checkout — no real payment is processed.
      </p>
    </div>
  );
};

export default BkashCheckout;
