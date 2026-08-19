"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ACCREDITATION_NUMBER,
  BUSINESS_ACN,
  BUSINESS_EMAIL,
  BUSINESS_PHONE,
  SITE_NAME,
} from "@/lib/seo";

export default function Footer() {
  const pathname = usePathname();
  // Self-contained card page with its own footer-free layout — see the
  // matching guard in Header.tsx.
  if (pathname === "/qrpage") return null;

  return (
    <footer>
      <div className="wrap foot-grid">
        <div className="foot-brand">
          <Image
            src="/images/Untitled-design-19.png"
            alt=""
            className="foot-logo"
            width={415}
            height={240}
          />
          <b>{SITE_NAME}</b>
          <p>
            Food, wine &amp; adventure tours from Sydney, New South Wales.
            Small groups, door to door.
          </p>
          <span className="foot-accred">
            Accredited operator · No. {ACCREDITATION_NUMBER}
          </span>
        </div>
        <div>
          <h4>Tours</h4>
          <ul>
            <li>
              <Link href="/hunter-valley-tour">Hunter Valley Tour</Link>
            </li>
            <li>
              <Link href="/private-tours">Private Tours</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li>
              <Link href="/about">About Jimmy</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/faq">FAQ</Link>
            </li>
            <li>
              <Link href="/recipes">Recipes</Link>
            </li>
            <li>
              <Link href="/shopping-in-sydney">Shopping in Sydney</Link>
            </li>
            <li>
              <Link href="/pick-up-map">Pick-up Map</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>Get in touch</h4>
          <ul>
            <li>
              <a href={`tel:${BUSINESS_PHONE}`}>0416 139 567</a>
            </li>
            <li>
              <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="wrap">
        <div className="foot-bottom">
          <span>
            &copy; {new Date().getFullYear()} {SITE_NAME} · ACN {BUSINESS_ACN}
          </span>
          <a
            href="/terms-and-conditions"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms &amp; Conditions
          </a>
        </div>
      </div>
    </footer>
  );
}
