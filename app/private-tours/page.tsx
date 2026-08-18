import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import Price from "@/components/Price";
import { privateTourEstimate } from "@/lib/tours";
import { getPrivateTourRate } from "@/lib/tours.server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Private Tours",
  description:
    "Your own guide, your own pace, and a day shaped around what you love. NSW destinations north, east, west and south of Sydney, for groups of 2 to 16.",
  alternates: { canonical: "/private-tours" },
};

export default async function PrivateToursPage() {
  const rate = await getPrivateTourRate();
  // A few sample party sizes above the flat-rate tier, capped at maxGuests,
  // so the estimate table scales with whatever the admin has set rather than
  // assuming today's numbers.
  const sampleGuestCounts = Array.from(
    new Set(
      [rate.baseCoversMax, rate.baseCoversMax + 2, rate.baseCoversMax + 4, rate.maxGuests].filter(
        (g) => g <= rate.maxGuests,
      ),
    ),
  ).sort((a, b) => a - b);

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

      <section className="pad">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">What it costs</span>
            <h2>Simple, guest-based pricing</h2>
            <p>
              One flat rate covers {rate.baseCoversMin}–{rate.baseCoversMax} guests, then a
              per-guest rate for anyone extra, up to {rate.maxGuests}.
            </p>
          </div>
          <div className="price-card" style={{ maxWidth: 420, margin: "0 auto" }}>
            <h3>Estimate your day</h3>
            <div className="price-row">
              <div>
                <b>
                  {rate.baseCoversMin}–{rate.baseCoversMax} guests
                </b>
                <br />
                <small>Flat rate</small>
              </div>
              <div className="amt">
                <Price aud={rate.base} />
              </div>
            </div>
            {sampleGuestCounts
              .filter((g) => g > rate.baseCoversMax)
              .map((g) => (
                <div className="price-row" key={g}>
                  <div>
                    <b>{g} guests</b>
                  </div>
                  <div className="amt">
                    <Price aud={privateTourEstimate(rate, g)} />
                  </div>
                </div>
              ))}
            <p style={{ fontSize: ".78rem", color: "var(--ink-soft)", marginTop: 12 }}>
              Includes {rate.includes.join(", ")}. Exact quote confirmed when you enquire.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <h2>Let&apos;s plan your private day</h2>
          <p>Tell us your group and dates — Jimmy will take it from there.</p>
          <a href="#enquire" className="btn btn-gold">
            Enquire now
          </a>
        </div>
      </section>

      <section className="pad" id="enquire">
        <div className="wrap" style={{ maxWidth: 560 }}>
          <div className="sec-head">
            <span className="eyebrow">Tell us about your day</span>
            <h2>Send an enquiry</h2>
          </div>
          <div className="contact-form">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
