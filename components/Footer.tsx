"use client";

import Link from "next/link";
import Image from "next/image";
import BookingCta from "./BookingCta";
import {
  ACCREDITATION_NUMBER,
  BUSINESS_ACN,
  BUSINESS_ADDRESS,
  BUSINESS_EMAIL,
  BUSINESS_PHONE,
  SITE_NAME,
} from "@/lib/seo";
import {
  FAREHARBOR_FLAGSHIP_ITEM_ID,
  giftBookingHref,
  tourItemId,
} from "@/lib/fareharbor";

export default function Footer() {
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
              <BookingCta itemId={FAREHARBOR_FLAGSHIP_ITEM_ID || undefined}>
                Hunter Valley Tour
              </BookingCta>
            </li>
            <li>
              <BookingCta itemId={tourItemId()}>Private Tours</BookingCta>
            </li>
            <li>
              <a href={giftBookingHref()}>Gift cards</a>
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
            <li>
              {BUSINESS_ADDRESS.street}, {BUSINESS_ADDRESS.suburb}{" "}
              {BUSINESS_ADDRESS.stateCode} {BUSINESS_ADDRESS.postcode}
            </li>
          </ul>
        </div>
      </div>
      <div className="wrap">
        <div className="foot-bottom">
          <span>
            &copy; {new Date().getFullYear()} {SITE_NAME} · ACN {BUSINESS_ACN}
          </span>
          <span>
            <Link href="/cancellation-policy">Cancellation policy</Link>
            {" · "}
            <Link href="/terms-and-conditions">Terms &amp; conditions</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
