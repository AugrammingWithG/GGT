"use client";

import { useState } from "react";
import PolicyGate from "./PolicyGate";
import { openFareHarbor } from "@/lib/fareharbor.client";
import { BOOKING_FALLBACK_HREF, FAREHARBOR_ENABLED } from "@/lib/fareharbor";

/**
 * A fixed booking CTA (header, footer) that isn't tied to a builder
 * selection. Unlike the builder's own path — enquiry form first, policy gate
 * right before checkout — these skip straight to FareHarbor, so the gate has
 * to sit in front of the click itself instead of behind a form.
 *
 * Renders a plain anchor when FareHarbor isn't configured, preserving the
 * on-page-builder fallback every other booking link uses; no gate needed
 * since there's no checkout to gate yet.
 */
export default function BookingCta({
  itemId,
  className,
  onClick,
  children,
}: {
  itemId?: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const [gateOpen, setGateOpen] = useState(false);

  if (!FAREHARBOR_ENABLED) {
    return (
      <a href={BOOKING_FALLBACK_HREF} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => setGateOpen(true)}
      >
        {children}
      </button>
      {gateOpen && (
        <PolicyGate
          onClose={() => setGateOpen(false)}
          onAgree={() => {
            setGateOpen(false);
            openFareHarbor({ itemId });
            onClick?.();
          }}
        />
      )}
    </>
  );
}
