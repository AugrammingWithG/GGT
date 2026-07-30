"use client";

import { openFareHarbor } from "@/lib/fareharbor.client";
import { BOOKING_FALLBACK_HREF, FAREHARBOR_ENABLED } from "@/lib/fareharbor";

/**
 * A fixed booking CTA (header, footer) that isn't tied to a builder
 * selection — clicking it goes straight to FareHarbor checkout, which
 * presents its own cancellation policy and terms & conditions.
 *
 * Renders a plain anchor when FareHarbor isn't configured, preserving the
 * on-page-builder fallback every other booking link uses.
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
  if (!FAREHARBOR_ENABLED) {
    return (
      <a href={BOOKING_FALLBACK_HREF} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        openFareHarbor({ itemId });
        onClick?.();
      }}
    >
      {children}
    </button>
  );
}
