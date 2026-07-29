import type { Metadata } from "next";
import BookingCta from "@/components/BookingCta";
import MissionBand from "@/components/MissionBand";
import TrustRow from "@/components/TrustRow";
import { FAREHARBOR_FLAGSHIP_ITEM_ID } from "@/lib/fareharbor";

export const metadata: Metadata = {
  title: "About Jimmy",
  description:
    "Your driver, your chef and your guide — all the same person, for thirty years. Owner-operated Hunter Valley tours since day one.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section
        className="page-hero"
        style={{
          backgroundImage: "url(/images/jimmy.webp)",
          // Jimmy's face sits in the upper third of this photo — a plain
          // center crop on this short, wide band cut it off entirely.
          backgroundPosition: "center 20%",
        }}
      >
        <div className="wrap">
          <span className="eyebrow">Owner-operated since day one</span>
          <h1>About Jimmy</h1>
          <p>
            Your driver, your chef and your guide — all the same person,
            for thirty years.
          </p>
        </div>
      </section>

      <section className="pad">
        <div className="wrap why-grid">
          <div>
            <span className="eyebrow">The whole point</span>
            <h2 style={{ fontSize: "2.2rem", margin: ".3em 0 .3em" }}>
              One person, start to finish
            </h2>
            <p style={{ color: "var(--ink-soft)", marginBottom: 14 }}>
              Thirty years cooking and guiding, always in small vehicles,
              never a coach. Every tour is Jimmy&apos;s from the first
              pickup to the last drop-off — that&apos;s what keeps guests
              coming back, and coming back again.
            </p>
            <p style={{ color: "var(--ink-soft)" }}>
              A qualified chef behind the wheel means the food isn&apos;t an
              afterthought. Menus are written by hand to match the wines
              you&apos;ll taste, and no two days run exactly the same.
            </p>
            <div className="stats">
              <div className="stat"><b>Jimmy</b><span>Owner, driver &amp; chef</span></div>
              <div className="stat"><b>30 years</b><span>On the road</span></div>
              <div className="stat"><b>Never a coach</b><span>Small vehicles only</span></div>
              <div className="stat"><b>5.0 ★</b><span>Tripadvisor rating</span></div>
            </div>
          </div>
          <div
            className="why-photo"
            style={{ backgroundImage: "url(/images/Hunter-Valley-Tour-image-5.jpg)" }}
          >
            <span>Jimmy at a cellar door</span>
          </div>
        </div>
      </section>

      <section className="pad" style={{ background: "var(--paper-2)" }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">A taste before you go</span>
            <h2>From Jimmy&apos;s kitchen</h2>
            <p>
              A little something we cook on the road — the rest, you&apos;ll
              taste on tour.
            </p>
          </div>
          <div className="recipe-card">
            <div
              className="recipe-photo"
              style={{ backgroundImage: "url(/images/creme-brulee-and-white-wine-1024x439-1.jpg)" }}
            >
              <span>The finished dish</span>
            </div>
            <div className="recipe-body">
              <span className="eyebrow">Roadside favourite</span>
              <h3>Pan-seared barramundi, lemon &amp; herb</h3>
              <p>
                Bright, simple and built to sit beside a chilled Hunter
                Semillon — the kind of plate that turns a lookout into a
                long lunch.
              </p>
              <ul className="recipe-ingredients">
                <li>Fresh barramundi fillets</li>
                <li>Lemon, olive oil &amp; sea salt</li>
                <li>Handful of local herbs</li>
                <li>Knob of butter to finish</li>
              </ul>
              <p className="recipe-note">
                Jimmy&apos;s tip: rest the fish skin-side up for a minute
                before serving so it stays crisp.
              </p>
            </div>
          </div>
        </div>
      </section>

      <MissionBand />

      <TrustRow lead="Awarded and featured across NSW tourism." />

      <section className="cta-band">
        <div className="wrap">
          <h2>Come along for the ride</h2>
          <p>Book the signature day, or plan a private one.</p>
          <BookingCta itemId={FAREHARBOR_FLAGSHIP_ITEM_ID || undefined} className="btn btn-gold">
            See the Hunter Valley tour
          </BookingCta>
        </div>
      </section>
    </>
  );
}
