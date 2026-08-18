"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { bokunLoaderSrc, bokunWidgetSrc } from "@/lib/bokun";

/**
 * State bag the loader script keeps on `window`. Not an API — it holds the
 * booking channel it bootstrapped with, and the loader early-returns if it
 * finds one already set (see `rebootLoader`).
 */
declare global {
  interface Window {
    __BokunWidgetsLoader?: {
      bookingChannelUUID?: string;
      origin?: string;
      isDuda?: boolean;
    };
  }
}

/**
 * How long to give the widget before deciding it isn't coming. The loader
 * bootstraps a second script from static.bokun.io which then renders the
 * calendar, so this has to cover two network round trips on a slow phone.
 */
const RENDER_GRACE_MS = 4000;

/** Placeholder the loader drops in immediately — not the real widget. */
const LOADING_PLACEHOLDER = /loading booking engine/i;

/** Has the widgets app actually taken this div over, or is it still a stub? */
function hasRendered(host: HTMLElement | null): boolean {
  if (!host) return false;
  // Stamped on each widget div the app has claimed.
  if (host.hasAttribute("data-bokun-widget-loaded")) return true;
  if (host.querySelector("iframe")) return true;
  // The loader fills the div with a "Loading booking engine..." block the
  // moment it runs, so children on their own prove nothing.
  const text = host.textContent?.trim() ?? "";
  return host.childElementCount > 0 && !LOADING_PLACEHOLDER.test(text);
}

/**
 * Forces the loader to bootstrap again.
 *
 * Re-adding the script by itself does nothing: the loader records the booking
 * channel on `window.__BokunWidgetsLoader` and returns early when it's already
 * set (it only speaks up — via `alert`) if a *different* channel is loaded.
 * Clearing that state first is what makes a second run take effect. The old
 * tag is removed before the new one goes in, so there's only ever one loader
 * script in the document.
 */
function rebootLoader(): void {
  delete window.__BokunWidgetsLoader;
  document
    .querySelectorAll('script[src*="BokunWidgetsLoader"]')
    .forEach((el) => el.remove());

  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = bokunLoaderSrc();
  script.async = true;
  document.body.appendChild(script);
}

/**
 * The Bókun booking calendar for one product.
 *
 * The loader script scans for `.bokunWidget` divs when it executes, and only
 * bootstraps once per page load. On a hard load that's all fine — `<Script
 * afterInteractive>` runs after this div is in the DOM. A client-side
 * navigation into this page is the awkward case: the script is already in the
 * document and self-guards against running twice, so a freshly-mounted div can
 * be left empty. The effect below watches for exactly that and re-bootstraps.
 */
export default function BokunWidget({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    // Only worth checking once the loader has had a fair go. On a hard load
    // this fires, finds the calendar already there, and does nothing.
    const timer = window.setTimeout(() => {
      if (cancelled || hasRendered(hostRef.current)) return;
      rebootLoader();
    }, RENDER_GRACE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [productId]);

  return (
    <div className={className}>
      <div ref={hostRef} className="bokunWidget" data-src={bokunWidgetSrc(productId)} />
      <noscript>Please enable javascript in your browser to book</noscript>
      {/*
        Loaded once for the whole app: next/script dedupes by `src`, so this
        never adds a second copy no matter how often the page is visited.
        Deliberately not in app/layout.tsx — only this page books.
      */}
      <Script src={bokunLoaderSrc()} strategy="afterInteractive" />
    </div>
  );
}
