import type { Metadata } from "next";
import Price from "@/components/Price";
import CurrencyPicker from "@/components/CurrencyPicker";
import BookingCta from "@/components/BookingCta";
import NextDeparture from "@/components/NextDeparture";
import RouteMap from "@/components/RouteMap";
import FaqAccordion from "@/components/FaqAccordion";
import { getTours } from "@/lib/tours.server";
import { FAREHARBOR_FLAGSHIP_ITEM_ID } from "@/lib/fareharbor";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hunter Valley Food & Wine Tour",
  description:
    "Our flagship day from Sydney — cellar doors, meals cooked by your guide, and wines matched to every course. Departs Monday & Wednesday.",
  alternates: { canonical: "/hunter-valley-tour" },
};

const PHOTO_STRIP = [
  { src: "/images/SYDNEY080118_0048-2.jpg", caption: "Kangaroos in the vines" },
  { src: "/images/SYDNEY080118_0034.jpg", caption: "Vineyard views" },
  { src: "/images/SYDNEY080118_0037-1.jpg", caption: "Cheese & tastings" },
  { src: "/images/SYDNEY080118_0210-1.jpg", caption: "Fresh produce" },
  { src: "/images/SYDNEY080118_0106.jpg", caption: "A long lunch" },
  { src: "/images/SYDNEY080118_0110.jpg", caption: "The pour" },
];

const TIMELINE = [
  { time: "6:35am", title: "Door-to-door pickup", body: "We collect you from your Sydney hotel and set off toward the Hunter." },
  { time: "Mid-morning", title: "Progressive breakfast", body: "A light cooked breakfast prepared by your chef/guide as we arrive." },
  { time: "Late morning", title: "Vineyard one", body: "Your first tasting, with wines chosen to match what's coming for lunch." },
  { time: "Midday", title: "Vineyard two & lunch", body: "A relaxed progressive lunch from local produce, three wines matched to the menu." },
  { time: "Afternoon", title: "Vineyard three", body: "A final cellar door, plus time to enjoy the rolling-hill scenery." },
  { time: "~6:30pm", title: "Home to Sydney", body: "We drop you back where we started, full and happy." },
];

const FAQS = [
  { q: "Can you cater for dietary requirements?", a: "Yes. As fellow food and wine lovers, we'll do our utmost to accommodate special diets — vegetarian, vegan, gluten-free and allergies. Just let us know when you book so your chef can plan the menu around you." },
  { q: "Can children come along?", a: "Absolutely — the tour is family friendly for ages 4 and up. We can't accommodate infants aged 0–3, and under-18s can't be served alcohol under Australian licensing laws." },
  { q: "Where do you pick up from?", a: "Door-to-door from selected Sydney hotels, roughly between 6:35 and 7:10am. Tell us where you're staying and we'll confirm your pickup time." },
  { q: "How big are the groups?", a: "Always small — between 2 and 16 guests, never a coach. That's the whole point: a personal day with your chef and guide." },
  { q: "What if I book direct?", a: "You save $20 per adult as a student of wine, with no booking fees — and it goes straight to Jimmy rather than a booking platform." },
];

export default async function HunterValleyTourPage() {
  const tours = await getTours();
  const tour = tours.find((t) => t.priceAdult != null);

  return (
    <>
      <section
        className="page-hero"
        style={{ backgroundImage: "url(/images/Hunter-Valley-Tour-image-1.jpg)" }}
      >
        <div className="wrap">
          <span className="eyebrow">Book online · Mon &amp; Wed</span>
          <h1>Hunter Valley Food &amp; Wine Tour</h1>
          <p>
            Our flagship day from Sydney — cellar doors, meals cooked by
            your guide, and wines matched to every course.
          </p>
        </div>
      </section>

      <section style={{ padding: "26px 0 0" }}>
        <div className="wrap">
          <div className="hv-strip">
            {PHOTO_STRIP.map((p) => (
              <div key={p.src} className="gph" style={{ backgroundImage: `url(${p.src})` }}>
                <em>{p.caption}</em>
              </div>
            ))}
          </div>
        </div>
      </section>

      {tour && (
        <section className="pad">
          <div className="wrap sig-grid">
            <div className="sig-left">
              <NextDeparture />
              <span className="eyebrow">The day at a glance</span>
              <h2 style={{ fontSize: "2rem", margin: ".3em 0 .4em" }}>
                A relaxed, full day in wine country
              </h2>
              <p style={{ color: "var(--ink-soft)" }}>
                Three hand-picked vineyards, a progressive breakfast and
                lunch, and plenty of time to soak up the scenery between
                stops. Small groups only, door to door from selected Sydney
                hotels.
              </p>
              <div className="sig-facts">
                <div className="fact"><b>{tour.days ?? "Mon & Wed"}</b><span>Departs weekly</span></div>
                <div className="fact"><b>{tour.duration ?? "Up to 11 hrs"}</b><span>Full day</span></div>
                <div className="fact"><b>{tour.min ?? 2}–{tour.max} guests</b><span>Small group</span></div>
                <div className="fact"><b>Ages {tour.minAge ?? 4}+</b><span>Family friendly</span></div>
                {tour.startTime && <div className="fact"><b>{tour.startTime}</b><span>Sydney pickup</span></div>}
                {tour.returnTime && <div className="fact"><b>{tour.returnTime}</b><span>Return</span></div>}
              </div>
            </div>
            <div className="price-card">
              <h3>Book this tour</h3>
              <div className="price-row"><div><b>Adult</b><br /><small>Ages 17+</small></div><div className="amt"><Price aud={tour.priceAdult!} /></div></div>
              {tour.priceSenior != null && <div className="price-row"><div><b>Senior</b><br /><small>65+</small></div><div className="amt"><Price aud={tour.priceSenior} /></div></div>}
              {tour.priceChild != null && <div className="price-row"><div><b>Child / student</b><br /><small>4–16 years</small></div><div className="amt"><Price aud={tour.priceChild} /></div></div>}
              <BookingCta itemId={tour.fareharborItemId || FAREHARBOR_FLAGSHIP_ITEM_ID || undefined} className="btn btn-wine">
                Check availability
              </BookingCta>
              <p style={{ fontSize: ".78rem", color: "var(--ink-soft)", marginTop: 12, textAlign: "center" }}>
                Students of wine save $20 per adult when booking direct.
              </p>
              <CurrencyPicker />
            </div>
          </div>
        </section>
      )}

      <section className="pad">
        <div className="wrap">
          <div className="delight">
            <span className="eyebrow">From the vine to the glass</span>
            <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.5rem)", margin: ".3em 0 .5em" }}>
              Delight in our food &amp; wine tours from Sydney
            </h2>
            <p className="lead">
              There&apos;s a reason people flock from all over NSW to the
              quiet, rolling hills of the Hunter Valley — and we&apos;ve
              discovered the secret.
            </p>
            <p>
              The Hunter is famous for its wineries and its cuisine cooked
              from fresh local produce. Our tours take you on a journey from
              the vine to the glass, with Australian-made wines matched to
              menus designed to complement every drop.
            </p>
            <p className="motto">
              &ldquo;Our wine is our canvas, and our food is our
              paint.&rdquo;
            </p>
            <p>
              Let us help you appreciate the art of perfectly matched wine
              and food at the region&apos;s most renowned wineries. Our
              mission is to make your day not just an outing, but an
              expedition — exploring vineyards and experiencing
              first-class cooking in idyllic surrounds.
            </p>
          </div>
        </div>
      </section>

      <section className="pad">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">The journey</span>
            <h2>Sydney to the vines, and home again</h2>
            <p>A relaxed loop with plenty of time between stops.</p>
          </div>
          <RouteMap />
        </div>
      </section>

      <section className="pad" style={{ background: "var(--paper-2)" }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Your day, hour by hour</span>
            <h2>How the day unfolds</h2>
          </div>
          <div className="timeline">
            {TIMELINE.map((item) => (
              <div key={item.time} className="tl-item">
                <div className="tl-time">{item.time}</div>
                <div className="tl-body">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pad">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">What to expect</span>
            <h2>Everything that&apos;s included</h2>
          </div>
          <ul className="expect-grid">
            {(tour?.inclusions ?? [
              "Complimentary pickup and drop-off",
              "Small tour group of 2–16 only",
              "Door to door service",
              "Progressive breakfast & lunch cooked by your chef/guide",
              "Three wine tastings matched to a modern Australian menu",
              "Special dietary requirements catered for",
              "Passionate local guides",
              "Comfortable air-conditioned transport",
              "Owner-operated tours",
            ]).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="restrict">
            <h4>Restrictions</h4>
            <ul>
              {(tour?.restrictions ?? [
                "We cannot accommodate infants aged 0–3 years.",
                "Guests under 18 cannot be served alcohol under Australian licensing laws.",
              ]).map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="pad" style={{ background: "var(--paper-2)" }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Good to know</span>
            <h2>Dietary needs &amp; common questions</h2>
          </div>
          <FaqAccordion items={FAQS} />
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <h2>Ready for a day in the Hunter?</h2>
          <p>Monday and Wednesday, straight from Sydney.</p>
          <BookingCta itemId={tour?.fareharborItemId || FAREHARBOR_FLAGSHIP_ITEM_ID || undefined} className="btn btn-gold">
            Check availability
          </BookingCta>
        </div>
      </section>
    </>
  );
}
