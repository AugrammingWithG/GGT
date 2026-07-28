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

  const headerClassName = isHome
    ? `header-overlay${scrolled ? " header-scrolled" : ""}`
    : undefined;

  return (
    <header className={headerClassName}>
      <div className="wrap nav">
        <Link href="/" className="brand" aria-label="Gourmet Getaway Tours, home">
          <Image
            src="/images/Untitled-design-19.png"
            alt=""
            className="header-logo"
            width={415}
            height={240}
            priority
          />
          <span className="brand-word">
            <b>Gourmet Getaway Tours</b>
            <span>Hunter Valley · NSW</span>
          </span>
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
