import type { Metadata } from "next";
import Link from "next/link";
import BookingCta from "@/components/BookingCta";
import ContactForm from "@/components/ContactForm";
import { tourItemId } from "@/lib/fareharbor";

export const metadata: Metadata = {
  title: "Private Tours",
  description:
    "Your own guide, your own pace, and a day shaped around what you love. NSW destinations north, east, west and south of Sydney, for groups of 2 to 16.",
  alternates: { canonical: "/private-tours" },
};

export default function PrivateToursPage() {
  return (
    <>
      <section
        className="page-hero"
        style={{ backgroundImage: "url(/images/SYDNEY080118_0037-1.jpg)" }}
      >
        <div className="wrap">
          <span className="eyebrow">Just your group</span>
          <h1>Private Tours</h1>
          <p>
            Your own guide, your own pace, and a day shaped around what you
            love. Destinations north, east, west and south of Sydney to
            choose from.
          </p>
        </div>
      </section>

      <section className="pad">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">How private tours work</span>
            <h2>Three steps to your day</h2>
          </div>
          <div className="steps">
            <div className="step">
              <span className="step-n">1</span>
              <h3>Pick a destination</h3>
              <p>Browse by direction — north, east, west or south — or mix destinations from a few.</p>
            </div>
            <div className="step">
              <span className="step-n">2</span>
              <h3>Tell us your group</h3>
              <p>Two to sixteen guests. Let us know numbers, dates and any dietary needs.</p>
            </div>
            <div className="step">
              <span className="step-n">3</span>
              <h3>We craft the day</h3>
              <p>Jimmy plans the route, the food and the tastings, then confirms your itinerary.</p>
            </div>
          </div>
          <p style={{ textAlign: "center", marginTop: 36 }}>
            See every destination laid out by direction on the{" "}
            <Link href="/#directions" style={{ color: "var(--wine)", fontWeight: 600 }}>
              home page
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <h2>Let&apos;s plan your private day</h2>
          <p>Tell us your group and dates — Jimmy will take it from there.</p>
          <BookingCta itemId={tourItemId()} className="btn btn-gold">
            Enquire now
          </BookingCta>
        </div>
      </section>

      <section className="pad">
        <div className="wrap" style={{ maxWidth: 560 }}>
          <div className="sec-head">
            <span className="eyebrow">Not ready to book?</span>
            <h2>Ask us first</h2>
          </div>
          <div className="contact-form">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
