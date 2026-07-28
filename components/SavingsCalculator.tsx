"use client";

import { useState } from "react";

const SAVING_PER_ADULT = 20;

export default function SavingsCalculator() {
  const [adults, setAdults] = useState(2);

  return (
    <div className="save-card">
      <span className="eyebrow">Book direct &amp; save</span>
      <h3>Students of wine save more</h3>
      <p className="sub">
        $20 off every adult when you book direct — no middle-man fees.
      </p>
      <div className="save-stepper">
        <button
          type="button"
          aria-label="Fewer adults"
          onClick={() => setAdults((a) => Math.max(1, a - 1))}
        >
          −
        </button>
        <div className="count">
          <span>{adults}</span>
          <small>Adults</small>
        </div>
        <button
          type="button"
          aria-label="More adults"
          onClick={() => setAdults((a) => Math.min(16, a + 1))}
        >
          +
        </button>
      </div>
      <div className="save-amount">
        <span>${adults * SAVING_PER_ADULT}</span>
        <small>saved on your booking</small>
      </div>
    </div>
  );
}
