"use client";

import { useEffect, useRef } from "react";
import Price from "./Price";
import BookingCta from "./BookingCta";
import { mediaBg } from "@/lib/media";
import { FAREHARBOR_FLAGSHIP_ITEM_ID } from "@/lib/fareharbor";

/**
 * Shared with NatureBackdrop, so the ambient colour behind the frosted-glass
 * sections below still echoes the hero photo, even though nothing dispatches
 * a per-slide event to it any more (that died with the old carousel's
 * autoplay/morph engine).
 */
export const HUNTER_BG = mediaBg(
  "linear-gradient(150deg,#858d47,#35381d)",
  "/images/tours/hunter.webp",
  "32% center",
);

/**
 * Splits a heading into words, each masked by an overflow-hidden span so the
 * inner word can slide/rotate up from behind it (see .hh-word / .hh-word-inner
 * in globals.css): a per-word curtain reveal rather than one flat fade.
 */
function MaskedTitle({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span className="hh-word" key={i}>
          <span
            className="hh-word-inner"
            style={{ animationDelay: `${0.35 + i * 0.09}s` }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </>
  );
}

/**
 * The site's opening view: Hunter Valley, the only tour bookable online and
 * the client's main product. Everything below (DestinationGallery onward) is
 * the other eight day trips, sold by enquiry rather than online booking.
 */
export default function HunterHero() {
  const bgRef = useRef<HTMLDivElement>(null);

  // Cursor parallax on the hero photo: a few pixels of drift, opposite the
  // pointer, on top of the ambient Ken Burns zoom. Desktop-pointer only (a
  // touch drag isn't "hovering" the photo) and skipped entirely under
  // prefers-reduced-motion.
  useEffect(() => {
    const bg = bgRef.current;
    const section = bg?.closest(".hh");
    if (!bg || !(section instanceof HTMLElement)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      bg.style.setProperty("--hh-px", `${px * -18}px`);
      bg.style.setProperty("--hh-py", `${py * -12}px`);
    };
    const onLeave = () => {
      bg.style.setProperty("--hh-px", "0px");
      bg.style.setProperty("--hh-py", "0px");
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section className="hh">
      <div
        ref={bgRef}
        className="hh-bg"
        style={{ background: HUNTER_BG }}
        aria-hidden
      />
      <div className="hh-scrim" aria-hidden />
      {/* .hh-inner is the same width/centring as header.overlay's row (see
          globals.css), so the copy lines up under the brand exactly like the
          old carousel's .dc-inner did. .hh-copy caps the actual text to a
          readable column within that wide row. */}
      <div className="hh-inner">
        <div className="hh-copy">
          <p className="hh-eyebrow">Our flagship day · Monday &amp; Wednesday</p>
          <h1 className="hh-title">
            <MaskedTitle text="Hunter Valley Food & Wine Tour" />
          </h1>
          <p className="hh-blurb">
            Cellar doors, a progressive breakfast and lunch cooked by your
            guide, and three wines matched to the menu: the only tour on
            this site you can book straight online.
          </p>

          <div className="hh-prices">
            <div className="hh-price">
              <span className="hh-amt">
                <Price aud={277} />
              </span>
              <span className="hh-plabel">Adult</span>
            </div>
            <div className="hh-price">
              <span className="hh-amt">
                <Price aud={267} />
              </span>
              <span className="hh-plabel">Senior</span>
            </div>
            <div className="hh-price">
              <span className="hh-amt">
                <Price aud={257} />
              </span>
              <span className="hh-plabel">Child / student, 4&ndash;16</span>
            </div>
          </div>

          <ul className="hh-meta">
            <li>Runs Monday &amp; Wednesday</li>
            <li>Up to 11 hours</li>
            <li>Pickup 6:35&ndash;7:10am, selected Sydney hotels</li>
            <li>Drop-off around 6:30pm</li>
          </ul>

          {/* This CTA books straight through to FareHarbor without passing
              through the builder, so the two age rules need to be readable
              here too, not only in the builder's own notice. */}
          <p className="hh-restrictions">
            Ages 4+ only. Infants 0&ndash;3 can&rsquo;t be accommodated.
            Guests under 18 can&rsquo;t be served alcohol.
          </p>

          <BookingCta
            itemId={FAREHARBOR_FLAGSHIP_ITEM_ID || undefined}
            className="btn btn-primary hh-cta btn-shine"
          >
            <span className="btn-badge" aria-hidden>
              →
            </span>
            Book now
          </BookingCta>
        </div>
      </div>

      <a
        href="#destinations"
        className="hh-scroll-cue"
        aria-label="Scroll to the other tours"
      >
        <span className="hh-scroll-cue-rail" aria-hidden />
        Explore
      </a>
    </section>
  );
}
