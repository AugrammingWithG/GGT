"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import BookingCta from "./BookingCta";
import ThemeToggle from "./ThemeToggle";
import { FAREHARBOR_ENABLED, FAREHARBOR_FLAGSHIP_ITEM_ID } from "@/lib/fareharbor";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/hunter-valley-tour", label: "Hunter Valley Tour" },
  { href: "/private-tours", label: "Private Tours" },
  { href: "/gallery", label: "Gallery of Good Memories" },
  { href: "/about", label: "About" },
  { href: "/recipes", label: "Recipes" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [compact, setCompact] = useState(false);
  const closeMenu = () => setOpen(false);
  const cta = FAREHARBOR_ENABLED ? "Book now" : "Build your tour";

  // Only the home page has a hero video for the header to float over — every
  // other page keeps the solid bar since there's nothing to show through it.
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // The compass dial (#directions) is the densest block on the page and the
  // fixed header floats right over its top edge. Shrink the bar while that
  // section holds the viewport so the four cards get the space back, then let
  // it grow again once the visitor scrolls on. Home only — no other page has
  // the section, and elsewhere the header is in flow, so resizing it would
  // reflow the whole page.
  useEffect(() => {
    if (!isHome) return;
    const section = document.getElementById("directions");
    if (!section || typeof IntersectionObserver === "undefined") return;
    // Watches the band between 12% and 70% down the viewport: the section has
    // to actually be the thing you're looking at, not merely peeking in at the
    // bottom edge, before the bar collapses.
    const observer = new IntersectionObserver(
      ([entry]) => setCompact(entry.isIntersecting),
      { rootMargin: "-12% 0px -30% 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [isHome]);

  const headerClassName = isHome
    ? `header-overlay${scrolled ? " header-scrolled" : ""}${
        compact ? " header-compact" : ""
      }`
    : undefined;

  return (
    <header className={headerClassName}>
      <div className="wrap nav">
        {/* The logo artwork already carries the wordmark and the
            "Hunter Valley · NSW" line, so the bar shows the mark alone —
            the name lives on in the link's aria-label for screen readers. */}
        <Link href="/" className="brand" aria-label="Gourmet Getaway Tours, home">
          <Image
            src="/images/Untitled-design-19.png"
            alt=""
            className="header-logo"
            width={415}
            height={240}
            priority
          />
        </Link>

        <nav className={open ? "nav-links open" : "nav-links"}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
          <BookingCta
            itemId={FAREHARBOR_FLAGSHIP_ITEM_ID || undefined}
            className="btn btn-wine"
            onClick={closeMenu}
          >
            {cta}
          </BookingCta>
        </nav>

        <ThemeToggle />

        <button
          className="burger"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
