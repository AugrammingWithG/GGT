import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shopping in Sydney",
  description:
    "Jimmy's picks for a day off tour — where to shop, browse and pick up something to take home.",
  alternates: { canonical: "/shopping-in-sydney" },
};

type Shop = {
  name: string;
  meta: string;
  blurb: string;
};

const SHOPS: Shop[] = [
  {
    name: "Volle Jewellery",
    meta: "Opals & fine jewellery",
    blurb:
      "A boutique collection of opals and precious gems, spanning modern settings and traditional cuts. Mention Jimmy sent you — regulars usually get a discount.",
  },
  {
    name: "Queen Victoria Building (QVB)",
    meta: "455 George St · Historic arcade",
    blurb:
      "A late-19th-century shopping gem in the heart of the CBD, lined with high-end boutiques, jewellers and specialty shops — including Haigh's Chocolates if you need a gift that travels well.",
  },
  {
    name: "The Rocks Markets",
    meta: "The Rocks · Weekends",
    blurb:
      "An open-air weekend market in Sydney's oldest quarter — handmade jewellery, art and gourmet food stalls, with the Harbour Bridge as a backdrop.",
  },
  {
    name: "Pitt Street Mall",
    meta: "Pitt St, CBD",
    blurb:
      "The city's main pedestrian shopping strip — Myer, David Jones, Zara, H&M and Uniqlo, plus everything in between for clothing, electronics and beauty.",
  },
  {
    name: "Paddington Markets",
    meta: "395 Oxford St, Paddington · Saturdays",
    blurb:
      "Running for over 40 years — local designers, emerging artists and handmade fashion, in one of Sydney's most walkable inner-city suburbs.",
  },
];

export default function ShoppingInSydneyPage() {
  return (
    <>
      <section
        className="page-hero"
        style={{ backgroundImage: "url(/images/Hunter-Valley-Tour-image-2.jpg)" }}
      >
        <div className="wrap">
          <span className="eyebrow">Off tour</span>
          <h1>Shopping in Sydney</h1>
          <p>
            A few of Jimmy&apos;s favourite spots for the days you&apos;re
            not with him.
          </p>
        </div>
      </section>

      <section className="pad">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Jimmy&apos;s picks</span>
            <h2>Where to shop between tours</h2>
            <p>
              Nothing to book here — just a few places worth the trip if
              you&apos;ve got a spare afternoon in the city.
            </p>
          </div>
          <div className="guide-grid">
            {SHOPS.map((s) => (
              <div key={s.name} className="guide-card">
                <h3>{s.name}</h3>
                <span className="guide-meta">{s.meta}</span>
                <p>{s.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <h2>Planning your Sydney days?</h2>
          <p>
            Ask us about pickup timing around your shopping plans — or see
            our{" "}
            <Link href="/private-tours" style={{ color: "#fff", textDecoration: "underline" }}>
              private tours
            </Link>{" "}
            for a guided city day instead.
          </p>
        </div>
      </section>
    </>
  );
}
