import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BUSINESS_PHONE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Quick Links",
  description: "Scan the QR code, tap through to what you need.",
  alternates: { canonical: "/qrpage" },
  // A QR-only landing page — not something search should surface on its own.
  robots: { index: false, follow: false },
};

// No direct Google review link (no Place ID on file) — this deep-links
// straight into the business's review section of a Google search result.
const GOOGLE_REVIEW_URL =
  "https://www.google.com/search?q=Gourmet+Getaway+Tours+Reviews#lrd=0x6b12aa496ff581bf:0x322031db22ecf984,3";

const TRIPADVISOR_REVIEW_URL =
  "https://www.tripadvisor.com/Attraction_Review-g255060-d7171789-Reviews-Gourmet_Getaway_Tours-Sydney_New_South_Wales.html";

type QrLink = {
  href: string;
  label: string;
  external?: boolean;
  image?: string;
  icon?: "google" | "tripadvisor" | "tip" | "contact";
};

const LINKS: QrLink[] = [
  {
    href: "/hunter-valley-tour",
    label: "Hunter Valley Food and Wine Tour from Sydney",
    image: "/images/Hunter-Valley-Tour-image-1.jpg",
  },
  {
    href: "/recipes",
    label: "Jimmy's Recipes",
    image: "/images/jimmy.webp",
  },
  {
    href: "/hunter-valley-tour",
    label: "Other Great Tours in Sydney",
    image: "/images/tours/hunter.webp",
  },
  {
    href: GOOGLE_REVIEW_URL,
    label: "Leave a Review on Google",
    external: true,
    icon: "google",
  },
  {
    href: TRIPADVISOR_REVIEW_URL,
    label: "Leave a Review on TripAdvisor",
    external: true,
    icon: "tripadvisor",
  },
  {
    href: "/shopping-in-sydney",
    label: "Shopping in Sydney",
    image: "/images/Hunter-Valley-Tour-image-2.jpg",
  },
  {
    href: "https://app.gotribuo.io/#/tip/VrcJ-N",
    label: "Tip Your Guide",
    external: true,
    icon: "tip",
  },
  {
    href: "/contact",
    label: "Contact Us",
    icon: "contact",
  },
];

function LinkAvatar({ link }: { link: QrLink }) {
  if (link.image) {
    return (
      <span className="qr-link-avatar">
        <Image src={link.image} alt="" width={58} height={58} />
      </span>
    );
  }

  if (link.icon === "google") {
    return (
      <span className="qr-link-avatar">
        <svg viewBox="0 0 48 48" width="32" height="32" aria-hidden="true">
          <path
            fill="#FFC107"
            d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
          />
          <path
            fill="#FF3D00"
            d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5.5 0 10.5-2.1 14.3-5.6l-6.6-5.6C29.6 34.7 26.9 36 24 36c-5.3 0-9.7-3.1-11.3-7.5l-6.6 5.1C9.6 39.7 16.3 44 24 44z"
          />
          <path
            fill="#1976D2"
            d="M43.6 20.5H42V20H24v8h11.3c-1 2.8-2.9 5.2-5.4 6.8l6.6 5.6C39.9 37.2 44 31.4 44 24c0-1.3-.1-2.7-.4-3.5z"
          />
        </svg>
      </span>
    );
  }

  if (link.icon === "tripadvisor") {
    return (
      <span className="qr-link-avatar">
        <Image
          src="/images/trust/tripadvisor.png"
          alt=""
          width={44}
          height={44}
          style={{ objectFit: "contain" }}
        />
      </span>
    );
  }

  if (link.icon === "tip") {
    return (
      <span className="qr-link-avatar">
        <svg
          viewBox="0 0 24 24"
          width="30"
          height="30"
          fill="none"
          stroke="#C0902B"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path
            d="M9.4 15.4c.4.85 1.4 1.4 2.6 1.4 1.7 0 2.9-.85 2.9-2.05 0-1.3-1.25-1.75-2.9-2.15-1.6-.4-2.85-.9-2.85-2.15 0-1.15 1.15-1.95 2.85-1.95 1.2 0 2.15.5 2.55 1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M12 6.3v11.4" strokeLinecap="round" />
        </svg>
      </span>
    );
  }

  return (
    <span className="qr-link-avatar">
      <svg
        viewBox="0 0 24 24"
        width="28"
        height="28"
        fill="none"
        stroke="#6E1E2E"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path
          d="M4.5 4h3.4l1.3 4.4-2 1.6a13 13 0 0 0 6.8 6.8l1.6-2 4.4 1.3v3.4c0 1-.9 1.8-1.9 1.7C10.9 20.5 3.5 13.1 2.8 6.9 2.7 5.9 3.5 4 4.5 4Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function QrPage() {
  return (
    <div className="qr-shell">
      <header className="qr-header">
        <div className="qr-header-inner">
          <Link href="/" aria-label="Gourmet Getaway Tours, home">
            <Image
              src="/images/Untitled-design-19.png"
              alt="Gourmet Getaway Tours"
              className="qr-logo"
              width={415}
              height={240}
              priority
            />
          </Link>
          <a className="qr-call-btn" href={`tel:${BUSINESS_PHONE}`}>
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                d="M4.5 4h3.4l1.3 4.4-2 1.6a13 13 0 0 0 6.8 6.8l1.6-2 4.4 1.3v3.4c0 1-.9 1.8-1.9 1.7C10.9 20.5 3.5 13.1 2.8 6.9 2.7 5.9 3.5 4 4.5 4Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Call Now
          </a>
        </div>
      </header>

      <div className="qr-body">
        <div className="qr-links">
          {LINKS.map((link) =>
            link.external ? (
              <a
                key={link.label}
                className="qr-link"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkAvatar link={link} />
                <span className="qr-link-label">{link.label}</span>
              </a>
            ) : (
              <Link key={link.label} className="qr-link" href={link.href}>
                <LinkAvatar link={link} />
                <span className="qr-link-label">{link.label}</span>
              </Link>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
