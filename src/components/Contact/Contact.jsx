"use client";

import { useState } from "react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiSend,
  FiFacebook,
  FiInstagram,
  FiYoutube,
} from "react-icons/fi";
import { saveContactMessage } from "@/action/server/contact";
import PageHero from "@/components/UI/PageHero";

const contactInfo = [
  { icon: FiMail, title: "Email Address", value: "support@herokids.com" },
  { icon: FiPhone, title: "Phone Number", value: "+880 1700-000000" },
  { icon: FiMapPin, title: "Our Location", value: "Dhaka, Bangladesh" },
  {
    icon: FiClock,
    title: "Working Hours",
    value: "Sat–Thu · 9:00 AM – 8:00 PM",
  },
];

const socials = [
  { icon: FiFacebook, label: "Facebook" },
  { icon: FiInstagram, label: "Instagram" },
  { icon: FiYoutube, label: "YouTube" },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus("");

    try {
      await saveContactMessage(form);
      setStatus("Thank you! Your message has been received.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus(
        "Sorry, your message could not be sent. Please try again later.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <PageHero
        kicker="Get in Touch"
        title="Contact Us"
        subtitle="Have questions about our toys, products, or orders? We are here to help you and your little ones."
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Info */}
          <div className="space-y-6 lg:col-span-2">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-secondary to-primary p-8 text-primary-content shadow-2xl">
              <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
              <div className="relative">
                <h2 className="font-display text-3xl font-bold">
                  Let&apos;s Talk!
                </h2>
                <p className="mt-3 leading-relaxed text-primary-content/90">
                  We would love to hear from you. Send us a message and our team
                  will be happy to help.
                </p>

                <div className="mt-8 space-y-5">
                  {contactInfo.map(({ icon: Icon, title, value }) => (
                    <div key={title} className="flex items-center gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/20">
                        <Icon size={20} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{title}</p>
                        <p className="text-sm text-primary-content/80">
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex gap-2 border-t border-white/20 pt-6">
                  {socials.map(({ icon: Icon, label }) => (
                    <a
                      key={label}
                      href="#"
                      aria-label={label}
                      className="btn btn-sm btn-circle border-0 bg-white/15 text-primary-content hover:bg-white hover:text-primary"
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-3xl border border-base-200 bg-base-100 p-6 shadow-xl sm:p-10 lg:col-span-3">
            <h2 className="font-display text-2xl font-bold">
              Send Us a Message
            </h2>
            <p className="mt-2 text-sm text-base-content/60">
              Fill out the form below and tell us how we can help.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="input input-bordered w-full rounded-2xl bg-base-200/60"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="input input-bordered w-full rounded-2xl bg-base-200/60"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-semibold"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  required
                  className="input input-bordered w-full rounded-2xl bg-base-200/60"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  rows={5}
                  required
                  className="textarea textarea-bordered w-full rounded-2xl bg-base-200/60"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="btn btn-primary btn-lg w-full rounded-full gap-2 shadow-lg shadow-primary/30"
              >
                {sending ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <FiSend />
                )}
                {sending ? "Sending..." : "Send Message"}
              </button>

              {status && (
                <p
                  role="status"
                  className={`alert rounded-2xl text-sm ${
                    status.startsWith("Thank you")
                      ? "alert-success"
                      : "alert-error"
                  }`}
                >
                  {status}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
