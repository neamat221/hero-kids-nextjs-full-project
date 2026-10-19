"use client";

import { useState } from "react";
import { FiSend, FiCheck } from "react-icons/fi";

const surfaces = {
  footer: "bg-white/10",
  cta: "bg-white/15",
};

const inputs = {
  footer: "text-neutral-content placeholder:text-neutral-content/50",
  cta: "text-primary-content placeholder:text-primary-content/70",
};

const buttons = {
  footer: "btn-primary text-primary-content",
  cta: "btn-neutral text-neutral-content",
};

export default function NewsletterForm({ variant = "footer" }) {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p
        role="status"
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${surfaces[variant] ?? surfaces.footer}`}
      >
        <FiCheck className="shrink-0" /> Thanks for subscribing! 🎉
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
      className={`flex w-full max-w-md items-center gap-2 rounded-full p-1 pl-4 backdrop-blur ${
        surfaces[variant] ?? surfaces.footer
      }`}
    >
      <input
        type="email"
        required
        placeholder="Enter your email"
        aria-label="Email for newsletter"
        className={`w-full bg-transparent text-sm outline-none ${
          inputs[variant] ?? inputs.footer
        }`}
      />
      <button
        type="submit"
        aria-label="Subscribe"
        className={`btn btn-circle btn-sm shrink-0 border-0 ${
          buttons[variant] ?? buttons.footer
        }`}
      >
        <FiSend size={16} />
      </button>
    </form>
  );
}
