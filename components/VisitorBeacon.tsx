"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Records one pageview per route change on the public site. Skipped under
 * /admin so Jimmy's own visits don't inflate the visitor counts he sees on
 * the dashboard those counts feed.
 */
export default function VisitorBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    fetch("/api/track", { method: "POST", keepalive: true }).catch(() => {});
  }, [pathname]);

  return null;
}
