"use client";

import { useState } from "react";

const TOUR_OPTIONS = [
  "Hunter Valley Food & Wine",
  "Blue Mountains Day Trip",
  "Orange & Mudgee",
  "Sydney Beaches & Brewery",
  "Kangaroo Valley",
  "Southern Highlands",
  "Half-Day Sydney Foodie",
  "Central Coast Oysters",
  "Not sure yet",
];

type Status = "idle" | "sending" | "ok" | "err";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tour, setTour] = useState(TOUR_OPTIONS[0]);
  const [message, setMessage] = useState("");
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
          message,
          tourId: "contact-form",
          tourName: tour,
          guests: 1,
          addOns: [],
          payOnDayAddOns: [],
          total: 0,
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
        Thanks — your enquiry is in. Jimmy will get back to you shortly. 🍷
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {status === "err" && <div className="form-msg err">{error}</div>}
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
        <label htmlFor="c-tour">Which tour?</label>
        <select id="c-tour" value={tour} onChange={(e) => setTour(e.target.value)}>
          {TOUR_OPTIONS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="c-msg">Message</label>
        <textarea
          id="c-msg"
          placeholder="Group size, dates, dietary needs…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
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
