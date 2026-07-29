import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS_ADDRESS, BUSINESS_PHONE, BUSINESS_EMAIL } from "@/lib/seo";
import PickupMap from "@/components/PickupMap";
import { PICKUP_POINTS } from "@/lib/pickups";

export const metadata: Metadata = {
  title: "Pick-up Map",
  description:
    "Where and when we pick up in Sydney — hotel pickup points and times for the Hunter Valley tour.",
  alternates: { canonical: "/pick-up-map" },
};

const MAP_QUERY = encodeURIComponent(
  `${BUSINESS_ADDRESS.street}, ${BUSINESS_ADDRESS.suburb} ${BUSINESS_ADDRESS.stateCode} ${BUSINESS_ADDRESS.postcode}`
);

export default function PickUpMapPage() {
  return (
    <>
      <section
        className="page-hero"
        style={{ background: "linear-gradient(135deg,#4A5D3A,#6E1E2E)" }}
      >
        <div className="wrap">
          <span className="eyebrow">Good to know</span>
          <h1>Pick-up Map</h1>
          <p>Where and when we&apos;ll collect you on tour day.</p>
        </div>
      </section>

      <section className="pad">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Hotel pickups</span>
            <h2>Sydney pickup points &amp; times</h2>
            <p>
              Not staying at one of these? Tell us your hotel when you book
              and we&apos;ll confirm the closest point and time.
            </p>
          </div>
          <div className="map-embed pickup-map-embed">
            <PickupMap points={PICKUP_POINTS} />
          </div>
          <div className="pickup-list">
            {PICKUP_POINTS.map((p) => (
              <div key={p.name} className="pickup-item">
                <div>
                  <b>{p.name}</b>
                  <a href={p.mapLink} target="_blank" rel="noopener noreferrer" className="pickup-item-link">
                    Open in Google Maps
                  </a>
                </div>
                <span>{p.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pad" style={{ background: "var(--paper-2)" }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Our base</span>
            <h2>{BUSINESS_ADDRESS.street}, {BUSINESS_ADDRESS.suburb}</h2>
          </div>
          <div className="map-embed">
            <iframe
              src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Map to Gourmet Getaway Tours"
            />
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <h2>Need to change your pickup?</h2>
          <p>
            Send us your booking details through the{" "}
            <Link href="/contact" style={{ color: "#fff", textDecoration: "underline" }}>
              contact form
            </Link>{" "}
            or call <a href={`tel:${BUSINESS_PHONE}`} style={{ color: "#fff", textDecoration: "underline" }}>0416 139 567</a>{" "}
            and we&apos;ll sort it out — you can also email{" "}
            <a href={`mailto:${BUSINESS_EMAIL}`} style={{ color: "#fff", textDecoration: "underline" }}>{BUSINESS_EMAIL}</a>.
          </p>
        </div>
      </section>
    </>
  );
}
