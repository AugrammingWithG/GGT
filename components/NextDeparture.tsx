"use client";

import { useEffect, useState } from "react";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Next Monday or Wednesday, computed client-side to avoid an SSR/local-clock mismatch. */
function nextDepartureLabel(): string | null {
  const today = new Date();
  for (let i = 0; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const day = d.getDay();
    if (day === 1 || day === 3) {
      const isToday = d.toDateString() === today.toDateString();
      return `${isToday ? "today, " : ""}${DAY_NAMES[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
    }
  }
  return null;
}

export default function NextDeparture() {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    setLabel(nextDepartureLabel());
  }, []);

  return (
    <div className="depart-pill">
      <span className="dot"></span>
      <span>
        {label
          ? `Next Hunter Valley departure: ${label} · a few seats left`
          : "Next departure loading…"}
      </span>
    </div>
  );
}
