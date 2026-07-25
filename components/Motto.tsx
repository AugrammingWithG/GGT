"use client";

import { useReveal } from "./useReveal";
import { useParallax } from "./useParallax";

export default function Motto() {
  const r = useReveal<HTMLDivElement>();
  const drift = useParallax<HTMLDivElement>(12);

  return (
    <section className="wrap">
      <div
        ref={(el) => {
          r.ref.current = el;
          drift.current = el;
        }}
        className={`motto ${r.className}`}
      >
        {/* The page's heading root. The hero above it is a carousel — every
            line in it changes per slide — so the H1/H2 that say who this is
            and what is sold live in the first fixed block instead. The H1
            takes the kicker slot the section already opened with, in the same
            .eyebrow type; the H2 carries the search phrase. */}
        <div className="motto-heads">
          <h1 className="eyebrow motto-brand">Gourmet Getaway Tours</h1>
          <h2 className="motto-kicker">
            Hunter Valley Food and Wine Tours from Sydney, NSW
          </h2>
        </div>
        <p className="motto-line">
          Wine is our <em>canvas</em>.<br />
          Food is our <em>paint</em>.
        </p>
      </div>
    </section>
  );
}
