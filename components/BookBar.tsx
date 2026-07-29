"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import BookingCta from "./BookingCta";
import { FAREHARBOR_FLAGSHIP_ITEM_ID } from "@/lib/fareharbor";

export default function BookBar() {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A visitor dismissing the bar shouldn't have it pop back up on the next
  // page they click through to.
  useEffect(() => {
    setDismissed(false);
  }, [pathname]);

  const onBookPage = pathname === "/" || pathname === "/hunter-valley-tour";
  const show = !dismissed && onBookPage && scrolled;

  return (
    <div className={show ? "bookbar show" : "bookbar"}>
      <div className="bookbar-inner">
        <div className="bb-txt">
          <b>Hunter Valley Food &amp; Wine Tour</b>
          <span>From A$257 · Mon &amp; Wed · save $20/adult direct</span>
        </div>
        <div className="bb-actions">
          <BookingCta
            itemId={FAREHARBOR_FLAGSHIP_ITEM_ID || undefined}
            className="btn btn-gold"
          >
            Book now
          </BookingCta>
          <button
            className="bookbar-close"
            aria-label="Hide"
            onClick={() => setDismissed(true)}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
