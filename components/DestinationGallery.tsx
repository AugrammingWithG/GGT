"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useReveal } from "./useReveal";
import EnquiryModal from "./EnquiryModal";
import Price from "./Price";
import { tourItemId } from "@/lib/fareharbor";
import { SHOWCASE_TOURS, showcaseBg, type ShowcaseTour } from "@/lib/showcase";

/**
 * A card's hover tilt/gloss, tracked via pointer position: rotateX/rotateY
 * and the gloss-highlight offset all live on CSS custom properties (see
 * .dg-card in globals.css) rather than direct style.transform, so they
 * compose with the entrance transition and the is-centre scale instead of
 * clobbering them. Mouse only: a touch drag on the track isn't "hovering".
 */
function tiltCard(e: ReactPointerEvent<HTMLDivElement>) {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width;
  const py = (e.clientY - r.top) / r.height;
  el.style.setProperty("--dg-rx", `${(0.5 - py) * 14}deg`);
  el.style.setProperty("--dg-ry", `${(px - 0.5) * 14}deg`);
  el.style.setProperty("--dg-mx", `${px * 100}%`);
  el.style.setProperty("--dg-my", `${py * 100}%`);
}

function untiltCard(e: ReactPointerEvent<HTMLDivElement>) {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget;
  el.style.setProperty("--dg-rx", "0deg");
  el.style.setProperty("--dg-ry", "0deg");
}

// Cloned onto each end of the track (see `extended` below) so there's always
// a neighbour peeking at both edges and the loop never dead-ends into blank
// track: scrolling past the last destination lands on a clone of the first
// (and past the first, a clone of the last), then a silent, instant
// scroll correction swaps it for the real card behind the scenes — see the
// settle-timeout in the centre-tracking effect — before anyone notices the
// seam. Two clones a side comfortably covers how many cards peek at once
// even on a wide viewport.
const CLONE = 2;

/**
 * The seven private-tour destinations, below the Hunter Valley hero: plain
 * inspiration, not a booking flow. A horizontal scroll-snap row the visitor
 * drags/swipes/scrolls or uses the arrows on, auto-advancing every 5s for
 * anyone who isn't; whichever card lands nearest the centre scales up (see
 * `updateCentre`). Each card's only action is an enquiry. Loops
 * indefinitely in both directions via the cloned padding cards above.
 */
export default function DestinationGallery() {
  const slides = SHOWCASE_TOURS;
  // The real slides with the last CLONE and first CLONE repeated on either
  // end, so the track always has something to show past either boundary.
  const extended = useMemo(
    () => [...slides.slice(-CLONE), ...slides, ...slides.slice(0, CLONE)],
    [slides],
  );
  const head = useReveal<HTMLDivElement>();
  const viewport = useReveal<HTMLDivElement>("dg-viewport");

  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const rafRef = useRef(0);
  const settleRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Extended-array index of the centred card (not the logical slide index —
  // see `logical` in the render below for that).
  const [centre, setCentre] = useState(CLONE);
  const [enquiryTour, setEnquiryTour] = useState<ShowcaseTour | null>(null);

  const scrollToCard = useCallback((i: number, smooth = true) => {
    const el = cardRefs.current[i];
    const track = trackRef.current;
    if (!el || !track) return;
    const target = el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2;
    if (smooth) {
      track.scrollTo({ left: target, behavior: "smooth" });
    } else {
      track.scrollLeft = target;
    }
  }, []);

  // Start centred on the first real destination, not the leading clones.
  useLayoutEffect(() => {
    scrollToCard(CLONE, false);
    // Only ever needs to run once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Whichever card's midpoint is closest to the track's own midpoint is "the"
  // centred card. Driven off the scroll event rather than an
  // IntersectionObserver threshold, so the scale-up tracks continuously as
  // the visitor drags rather than snapping in discrete steps.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateCentre = () => {
      const mid = track.scrollLeft + track.clientWidth / 2;
      let closest = CLONE;
      let closestDist = Infinity;
      extended.forEach((_, i) => {
        const el = cardRefs.current[i];
        if (!el) return;
        const cardMid = el.offsetLeft + el.offsetWidth / 2;
        const dist = Math.abs(cardMid - mid);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      setCentre(closest);

      // Once scrolling has settled on a cloned card, jump straight to the
      // equivalent real card at the opposite end. It looks identical, so the
      // swap is invisible — it just keeps the index space finite so the loop
      // can run forever instead of running out of clones.
      clearTimeout(settleRef.current);
      settleRef.current = setTimeout(() => {
        if (closest < CLONE) {
          scrollToCard(closest + slides.length, false);
          setCentre(closest + slides.length);
        } else if (closest >= CLONE + slides.length) {
          scrollToCard(closest - slides.length, false);
          setCentre(closest - slides.length);
        }
      }, 120);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateCentre);
    };

    updateCentre();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(settleRef.current);
    };
  }, [extended, slides.length, scrollToCard]);

  const centreRef = useRef(centre);
  useEffect(() => {
    centreRef.current = centre;
  }, [centre]);

  const modalOpenRef = useRef(false);
  useEffect(() => {
    modalOpenRef.current = enquiryTour !== null;
  }, [enquiryTour]);

  // Auto-advance to the next destination every 5s, looping back to the
  // first after the last. A nudge for anyone who isn't actively browsing,
  // not a hijack: it pauses the instant the pointer is anywhere over the
  // gallery (track or arrows, hover or drag) or an enquiry is open, and
  // picks back up once they're done. Skipped entirely under
  // prefers-reduced-motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const hoverZone = viewport.ref.current;
    if (!hoverZone) return;

    let hovering = false;
    const onEnter = () => {
      hovering = true;
    };
    const onLeave = () => {
      hovering = false;
    };
    hoverZone.addEventListener("pointerenter", onEnter);
    hoverZone.addEventListener("pointerleave", onLeave);

    const id = setInterval(() => {
      if (hovering || modalOpenRef.current) return;
      // No wrapping needed here: stepping past the last real card lands on
      // a clone, which the settle-correction above swaps for the real thing.
      scrollToCard(centreRef.current + 1);
    }, 5000);

    return () => {
      clearInterval(id);
      hoverZone.removeEventListener("pointerenter", onEnter);
      hoverZone.removeEventListener("pointerleave", onLeave);
    };
  }, [scrollToCard, viewport.ref]);

  return (
    <section className="dg wrap" id="destinations">
      <div ref={head.ref} className={`dg-head ${head.className}`}>
        <p className="eyebrow">7 destinations · your itinerary</p>
        <h2 className="dg-title">Build a private tour</h2>
        <p className="dg-lead">
          Just your group. Choose a destination, the number of guests and the
          extras you fancy: oyster farm, truffle hunt, distillery and more.
        </p>
        <a href="#builder" className="btn btn-primary dg-head-cta btn-shine">
          Start building <span className="btn-arrow">→</span>
        </a>
        <p className="eyebrow dg-kicker">Seven more ways to spend the day</p>
      </div>

      <div ref={viewport.ref} className={viewport.className}>
        <button
          type="button"
          className="tmns-btn dg-arrow dg-arrow-prev"
          onClick={() => scrollToCard(centre - 1)}
          aria-label="Previous destination"
        >
          ‹
        </button>

        <div className="dg-track" ref={trackRef}>
          {extended.map((s, i) => {
            const logical = (i - CLONE + slides.length) % slides.length;
            return (
              <div
                key={`${s.id}-${i}`}
                className={i === centre ? "dg-card is-centre" : "dg-card"}
                ref={(el) => {
                  cardRefs.current[i] = el;
                  el?.style.setProperty("--dg-delay", `${logical * 70}ms`);
                }}
                onPointerMove={tiltCard}
                onPointerLeave={untiltCard}
              >
                <button
                  type="button"
                  className="dg-photo"
                  style={{ background: showcaseBg(s) }}
                  onClick={() => scrollToCard(i)}
                  aria-label={`Centre ${s.name}`}
                />
                <div className="dg-overlay" aria-hidden>
                  <p className="dg-name">{s.name}</p>
                  <p className="dg-region">{s.region}</p>
                  {s.priceFromAdult != null && (
                    <p className="dg-price">
                      <Price aud={s.priceFromAdult} /> pp, adult
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  className="btn btn-primary dg-enquire btn-shine"
                  onClick={() => setEnquiryTour(s)}
                >
                  Enquire →
                </button>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="tmns-btn dg-arrow dg-arrow-next"
          onClick={() => scrollToCard(centre + 1)}
          aria-label="Next destination"
        >
          ›
        </button>
      </div>

      {enquiryTour && (
        <EnquiryModal
          draft={{
            tourId: enquiryTour.id,
            tourName: enquiryTour.name,
            guests: 2,
            addOns: [],
            payOnDayAddOns: [],
            total: 0,
            fareharborItemId: tourItemId(),
          }}
          onClose={() => setEnquiryTour(null)}
        />
      )}
    </section>
  );
}
