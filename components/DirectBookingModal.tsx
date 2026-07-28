"use client";

import { useEffect, useState } from "react";

/**
 * One-time "book direct and save" popup. Mounted once in the root layout, so
 * it fires a single time per session load rather than on every page.
 */
export default function DirectBookingModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 1800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div className="overlay show" onClick={() => setOpen(false)}>
      <div
        className="modal modal-simple"
        role="dialog"
        aria-modal="true"
        aria-labelledby="direct-booking-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-dark"
          aria-label="Close"
          onClick={() => setOpen(false)}
        >
          ×
        </button>
        <h3 id="direct-booking-title">Thanks for booking direct 🍷</h3>
        <p>
          Save <b>$20 off the adult price</b> by selecting{" "}
          <b>&ldquo;Student of wine&rdquo;</b> at checkout.
        </p>
        <button className="btn btn-wine" onClick={() => setOpen(false)}>
          Got it
        </button>
      </div>
    </div>
  );
}
