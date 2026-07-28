import Price from "@/components/Price";
import CurrencyPicker from "@/components/CurrencyPicker";
import BookingCta from "@/components/BookingCta";
import TourCard from "@/components/TourCard";
import HeroVideo from "@/components/HeroVideo";
import NextDeparture from "@/components/NextDeparture";
import CompassRose from "@/components/CompassRose";
import RegionCard from "@/components/RegionCard";
import StoryChapters from "@/components/StoryChapters";
import WineFoodPairing from "@/components/WineFoodPairing";
import SeasonPanel from "@/components/SeasonPanel";
import MissionBand from "@/components/MissionBand";
import SavingsCalculator from "@/components/SavingsCalculator";
import Reviews from "@/components/Reviews";
import TrustRow from "@/components/TrustRow";
import { getTours } from "@/lib/tours.server";
import { toursJsonLd, SOCIAL_LINKS } from "@/lib/seo";
import { SHOWCASE_TOURS } from "@/lib/showcase";
import { REGIONS } from "@/lib/regions";
import { FAREHARBOR_FLAGSHIP_ITEM_ID } from "@/lib/fareharbor";

const north = REGIONS.find((r) => r.id === "north")!;
const east = REGIONS.find((r) => r.id === "east")!;
const west = REGIONS.find((r) => r.id === "west")!;
const south = REGIONS.find((r) => r.id === "south")!;

// Re-fetch tour data on each request so Firestore edits show up without rebuild.
export const dynamic = "force-dynamic";

// Self-hosted (see public/videos/hero.mp4) rather than a YouTube embed —
// see HeroVideo.tsx for why.
const HERO_VIDEO_SRC = "/videos/hero.mp4";

const GUEST_PHOTOS = [
  { src: "/images/SYDNEY080118_0010.jpg", caption: "Breakfast on the road" },
  { src: "/images/SYDNEY080118_0034.jpg", caption: "Vineyard views" },
  { src: "/images/SYDNEY080118_0037-1.jpg", caption: "Cheese & tastings" },
  { src: "/images/SYDNEY080118_0048-2.jpg", caption: "Kangaroos in the vines" },
  { src: "/images/SYDNEY080118_0106.jpg", caption: "Clifftop lunch" },
  { src: "/images/SYDNEY080118_0110.jpg", caption: "The pour" },
  { src: "/images/SYDNEY080118_0210-1.jpg", caption: "Fresh local produce" },
  { src: "/images/SYDNEY080118_0170.jpg", caption: "Guests & Jimmy" },
];

const EXPECT_LIST = [
  "Complimentary pickup and drop-off",
  "Small tour group of 2–16 only",
  "Door to door service",
  "Progressive breakfast & lunch cooked by your chef/guide",
  "Three wine tastings matched to a modern Australian menu",
  "Special dietary requirements catered for",
  "Passionate local guides",
  "Comfortable air-conditioned transport",
  "Flexible and friendly experience",
  "Professional service",
  "Owner-operated tours",
  "Over 30 years in catering and tour guiding",
];

export default async function Home() {
  const tours = await getTours();
  const hunterValley = tours.find((t) => t.priceAdult != null);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toursJsonLd(tours)) }}
      />

      {/* Hero */}
      <section className="hero">
        <div className="video-frame">
          <HeroVideo
            src={HERO_VIDEO_SRC}
            poster="/images/Hunter-Valley-Tour-image-2.jpg"
          />
          <div className="hero-promo-badge">
            <span className="hero-promo-badge-icon" aria-hidden="true">
              🍷
            </span>
            <span>
              Book direct &amp; save <strong>$20 off the adult price</strong>
            </span>
          </div>
          <div className="hero-copy">
            <div className="inner">
              <h1>Gourmet Getaway Tours</h1>
              <p>Chef-led Hunter Valley food &amp; wine tours, from Sydney.</p>
              <div className="hero-actions">
                <BookingCta
                  itemId={FAREHARBOR_FLAGSHIP_ITEM_ID || undefined}
                  className="btn btn-gold"
                >
                  Book Now
                </BookingCta>
              </div>
            </div>
          </div>
          <a className="scroll-cue" href="#directions">
            Scroll down to see our private tours <span className="arrow">↓</span>
          </a>
        </div>
      </section>

      {/* Private tours, laid out around a compass — the first thing you hit
          scrolling down from the hero. */}
      <section className="pad" id="directions">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Choose your direction</span>
            <h2>Our private tours, by direction</h2>
            <p>Every destination we run, laid out exactly where it sits from Sydney.</p>
          </div>
          <div className="compass-layout">
            <RegionCard region={north} className="region-north" />
            <RegionCard region={west} className="region-west" />
            <div className="compass-hub">
              <CompassRose />
            </div>
            <RegionCard region={east} className="region-east" />
            <RegionCard region={south} className="region-south" />
          </div>
        </div>
      </section>

      {/* All tours, visible at once */}
      <section className="pad" style={{ background: "var(--paper-2)" }} id="tours">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Choose your day</span>
            <h2>Our Tours</h2>
            <p>
              One signature day you can book online, plus seven private-tour
              destinations built around you.
            </p>
          </div>
          <div className="tours">
            {hunterValley && (
              <TourCard
                id={hunterValley.id}
                image="/images/tours/hunter.webp"
                label="Hunter Valley"
                name="Hunter Valley Food & Wine"
                blurb="Our signature day. Cellar doors, chef-cooked meals and wines matched to the menu."
                fromPriceAud={hunterValley.priceChild ?? hunterValley.priceAdult}
                online
                featured
              />
            )}
            {SHOWCASE_TOURS.map((t) => (
              <TourCard
                key={t.id}
                id={t.id}
                image={t.image ?? ""}
                focus={t.focus}
                label={t.region}
                name={t.name}
                blurb={t.blurb}
                fromPriceAud={t.priceFromAdult}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Signature tour: pricing + facts */}
      {hunterValley && (
        <section className="signature">
          <div className="wrap sig-grid">
            <div className="sig-left">
              <NextDeparture />
              <span className="eyebrow">Our flagship day</span>
              <h2>Hunter Valley Food &amp; Wine Tour</h2>
              <p>
                Cellar doors, a progressive breakfast and lunch cooked by
                your guide, and three wines matched to the menu. The one
                tour you can book straight online.
              </p>
              <div className="sig-facts">
                <div className="fact">
                  <b>{hunterValley.days ?? "Mon & Wed"}</b>
                  <span>Departs weekly</span>
                </div>
                <div className="fact">
                  <b>{hunterValley.duration ?? "Up to 11 hrs"}</b>
                  <span>Full day</span>
                </div>
                <div className="fact">
                  <b>{hunterValley.min ?? 2}–{hunterValley.max} guests</b>
                  <span>Small group</span>
                </div>
                <div className="fact">
                  <b>Ages {hunterValley.minAge ?? 4}+</b>
                  <span>Family friendly</span>
                </div>
              </div>
            </div>
            <div className="price-card">
              <h3>Book this tour</h3>
              <div className="price-row">
                <div>
                  <b>Adult</b>
                  <br />
                  <small>Ages 17+</small>
                </div>
                <div className="amt">
                  <Price aud={hunterValley.priceAdult!} />
                </div>
              </div>
              {hunterValley.priceSenior != null && (
                <div className="price-row">
                  <div>
                    <b>Senior</b>
                    <br />
                    <small>65+</small>
                  </div>
                  <div className="amt">
                    <Price aud={hunterValley.priceSenior} />
                  </div>
                </div>
              )}
              {hunterValley.priceChild != null && (
                <div className="price-row">
                  <div>
                    <b>Child / student</b>
                    <br />
                    <small>4–16 years</small>
                  </div>
                  <div className="amt">
                    <Price aud={hunterValley.priceChild} />
                  </div>
                </div>
              )}
              <BookingCta
                itemId={hunterValley.fareharborItemId || FAREHARBOR_FLAGSHIP_ITEM_ID || undefined}
                className="btn btn-wine"
              >
                Check availability
              </BookingCta>
              <CurrencyPicker />
            </div>
          </div>
        </section>
      )}

      {/* The story of the day */}
      <section className="pad story">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">What makes the day</span>
            <h2>The story of your Hunter Valley day</h2>
            <p>
              Four things set this tour apart, from the man behind the wheel
              to the last glass poured.
            </p>
          </div>
          <StoryChapters />
        </div>
      </section>

      {/* Wine & food pairing */}
      <section className="pad" style={{ background: "var(--paper-2)" }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Wine is our canvas, food is our paint</span>
            <h2>See how we match the day</h2>
            <p>Tap a wine to see the dish it&apos;s poured alongside.</p>
          </div>
          <WineFoodPairing />
        </div>
      </section>

      {/* What's in season */}
      <section className="pad">
        <div className="wrap">
          <SeasonPanel />
        </div>
      </section>

      <MissionBand />

      {/* What to expect */}
      <section className="pad">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">What to expect</span>
            <h2>Everything that&apos;s included</h2>
            <p>
              From the moment we pick you up to the last drop-off, it&apos;s
              all taken care of.
            </p>
          </div>
          <ul className="expect-grid">
            {EXPECT_LIST.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Direct-booking savings counter */}
      <section className="pad save-band">
        <div className="wrap">
          <SavingsCalculator />
        </div>
      </section>

      {/* Why book with us */}
      <section className="pad why" id="why">
        <div className="wrap why-grid">
          <div>
            <span className="eyebrow">Why guests come back</span>
            <h2 style={{ fontSize: "2.2rem", margin: ".3em 0 .2em" }}>
              Your driver, your chef, your guide
            </h2>
            <p style={{ color: "var(--ink-soft)" }}>
              Thirty years cooking and guiding, in small vehicles, never a
              coach. Every tour is Jimmy&apos;s, start to finish — that&apos;s
              the whole point.
            </p>
            <div className="stats">
              <div className="stat">
                <b>Jimmy</b>
                <span>Owner, driver &amp; chef</span>
              </div>
              <div className="stat">
                <b>30 years</b>
                <span>On the road</span>
              </div>
              <div className="stat">
                <b>Never a coach</b>
                <span>Small vehicles only</span>
              </div>
              <div className="stat">
                <b>5.0 ★</b>
                <span>Tripadvisor rating</span>
              </div>
            </div>
          </div>
          <div
            className="why-photo"
            style={{ backgroundImage: "url(/images/jimmy.webp)" }}
          >
            <span>Jimmy, cooking on the road</span>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="pad">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">5.0 on Tripadvisor</span>
            <h2>Guests on tour with Jimmy</h2>
            <p>Straight from Tripadvisor, after a day on the road.</p>
          </div>
          <Reviews />
        </div>
      </section>

      {/* Guest photo wall */}
      <section className="pad" style={{ background: "var(--paper-2)" }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Postcards from the road</span>
            <h2>Come along for the ride</h2>
            <p>
              Behind-the-scenes cooks, cellar doors and clifftop lunches —
              see where the van heads next.
            </p>
          </div>
          <div className="gallery">
            {GUEST_PHOTOS.map((p) => (
              <div
                key={p.src}
                className="gph"
                style={{ backgroundImage: `url(${p.src})` }}
              >
                <em>{p.caption}</em>
              </div>
            ))}
          </div>
          <div className="follow-links">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.name}
                className="btn btn-outline"
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.cta}
              </a>
            ))}
          </div>
        </div>
      </section>

      <TrustRow lead="We're accredited tour operators, trusted on the world's best booking platforms." />
    </>
  );
}
