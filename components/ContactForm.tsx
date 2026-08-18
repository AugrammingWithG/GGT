"use client";

import { useState } from "react";
import ContactFallback from "./ContactFallback";

const REGION_OPTIONS = ["North", "East", "West", "South", "Not sure"];

type Status = "idle" | "sending" | "ok" | "err";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [guests, setGuests] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          region,
          preferredDate: date,
          guests: guests ? Number(guests) : 2,
          tourId: "contact-form",
          tourName: "Private Tour Enquiry",
          addOns: [],
          payOnDayAddOns: [],
          total: 0,
          company,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }
      setStatus("ok");
    } catch (err) {
      setStatus("err");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "ok") {
    return (
      <p style={{ color: "var(--green)", fontWeight: 600, fontSize: ".9rem", textAlign: "center" }}>
        Thanks! Your enquiry&apos;s on its way. Jimmy will get back to you soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {status === "err" && (
        <div className="form-msg err">
          {error} <ContactFallback />
        </div>
      )}
      <div className="form-field">
        <label htmlFor="c-name">Name</label>
        <input
          id="c-name"
          type="text"
          placeholder="Your name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-field">
        <label htmlFor="c-email">Email</label>
        <input
          id="c-email"
          type="email"
          placeholder="you@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-field">
        <label htmlFor="c-phone">Phone (optional)</label>
        <input
          id="c-phone"
          type="tel"
          placeholder="04xx xxx xxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="form-field">
        <label htmlFor="c-region">Region of interest</label>
        <select id="c-region" value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="">Select a region…</option>
          {REGION_OPTIONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="c-guests">Group size</label>
        <input
          id="c-guests"
          type="number"
          min={2}
          max={16}
          placeholder="2–16 guests"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
        />
      </div>
      <div className="form-field">
        <label htmlFor="c-date">Preferred date (optional)</label>
        <input
          id="c-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="form-field">
        <label htmlFor="c-msg">Your questions</label>
        <textarea
          id="c-msg"
          placeholder="Group size, dates, dietary needs…"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px" }}
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />
      <button
        type="submit"
        className="btn btn-wine"
        disabled={status === "sending"}
        style={{ width: "100%", justifyContent: "center" }}
      >
        {status === "sending" ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
