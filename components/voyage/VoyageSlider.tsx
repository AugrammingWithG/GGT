"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import EnquiryModal from "../EnquiryModal";
import Price from "../Price";
import { useReveal } from "../useReveal";
import { tourItemId } from "@/lib/fareharbor";
import { SHOWCASE_TOURS, showcaseBg } from "@/lib/showcase";
import { useCardMorph } from "./useCardMorph";
import SliderHeadline from "./SliderHeadline";
import SideCardTrack, { type SideCardTrackHandle } from "./SideCardTrack";

const AUTO_MS = 5000;
const LEAVE_MS = 900;

/**
 * Full-screen hero slider for the seven private-tour showcase destinations:
 * the active side card zooms into the full-bleed background (see
 * useCardMorph.ts), the headline wipes line-by-line in sync, and the side
 * card rail (SideCardTrack) doubles as navigation. Sits directly below
 * HunterHero, in the slot DestinationGallery used to occupy — same seven
 * destinations, same enquiry flow, new presentation.
 */
export default function VoyageSlider() {
  const tours = SHOWCASE_TOURS;

  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [bgTour, setBgTour] = useState(tours[0]);
  const [leavingTour, setLeavingTour] = useState<(typeof tours)[number] | null>(null);
  const [enquiryTour, setEnquiryTour] = useState<(typeof tours)[number] | null>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const modalOpenRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const sideTrackRef = useRef<SideCardTrackHandle>(null);

  const { ghostRef, play: playMorph } = useCardMorph(sectionRef, bgRef);

  // Scroll-reveal for the section's entrance (see useReveal.ts, the same
  // fade/rise every other section on the page uses) — staggered via the
  // transition-delay rules on .vs-bg/.vs-word/.vs-copy/.vs-cards-wrap.reveal,
  // so this section arrives as a small cascade instead of popping in flat.
  const bgReveal = useReveal<HTMLDivElement>();
  const topKickerReveal = useReveal<HTMLParagraphElement>();
  const wordReveal = useReveal<HTMLParagraphElement>();
  const copyReveal = useReveal<HTMLDivElement>();
  const cardsReveal = useReveal<HTMLDivElement>();

  // Holds the latest `navigate` so the autoplay interval (set up by
  // `startTimer`, which must itself be callable from inside `navigate` to
  // reset the countdown on every slide change) never closes over a stale
  // copy without the two hooks having to reference each other directly.
  const navigateRef = useRef<(n: number, fromRect?: DOMRect) => void>(() => {});

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    if (reducedMotionRef.current) return;
    // Deliberately doesn't pause on hover: the rail is meant to loop
    // continuously, not stall the moment a cursor rests anywhere on the
    // section (which, at full-viewport height, is most of the time).
    timerRef.current = setInterval(() => {
      if (modalOpenRef.current) return;
      const rect = sideTrackRef.current?.getUpcomingRect() ?? undefined;
      navigateRef.current(indexRef.current + 1, rect);
    }, AUTO_MS);
  }, []);

  const navigate = useCallback(
    (raw: number, fromRect?: DOMRect) => {
      const n = ((raw % tours.length) + tours.length) % tours.length;
      if (n === indexRef.current) return;
      const targetTour = tours[n];
      setLeavingTour(tours[indexRef.current]);
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = setTimeout(() => setLeavingTour(null), LEAVE_MS);
      indexRef.current = n;
      setIndex(n);
      startTimer();

      if (fromRect && !reducedMotionRef.current) {
        playMorph(fromRect, targetTour, () => setBgTour(targetTour));
      } else {
        setBgTour(targetTour);
      }
    },
    [tours, startTimer, playMorph],
  );
  navigateRef.current = navigate;

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    startTimer();
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(leaveTimerRef.current);
    };
  }, [startTimer]);

  useEffect(() => {
    modalOpenRef.current = enquiryTour !== null;
  }, [enquiryTour]);

  // Pointer parallax on the giant background word vs. the photo layer: two
  // different drift rates off the same cursor position, the same trick
  // HunterHero uses for its own hero photo, so the word reads as sitting at
  // a different depth than the background instead of pinned flat to it.
  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    if (reducedMotionRef.current) return;
    const section = e.currentTarget;
    const r = section.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    section.style.setProperty("--vs-bg-px", `${px * -14}px`);
    section.style.setProperty("--vs-bg-py", `${py * -10}px`);
    section.style.setProperty("--vs-word-px", `${px * -42}px`);
    section.style.setProperty("--vs-word-py", `${py * -26}px`);
  }, []);

  const onPointerLeave = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    const section = e.currentTarget;
    section.style.setProperty("--vs-bg-px", "0px");
    section.style.setProperty("--vs-bg-py", "0px");
    section.style.setProperty("--vs-word-px", "0px");
    section.style.setProperty("--vs-word-py", "0px");
  }, []);

  const tour = tours[index];

  return (
    <section
      ref={sectionRef}
      className="vs"
      id="destinations"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <p
        ref={topKickerReveal.ref}
        className={`vs-top-kicker ${topKickerReveal.className}`}
        aria-hidden
      >
        7 Private Tour Destinations
      </p>

      <p
        ref={wordReveal.ref}
        className={`vs-word ${wordReveal.className}`}
        aria-hidden
      >
        GETAWAY
      </p>

      <div
        className={`vs-bg ${bgReveal.className}`}
        ref={(el) => {
          bgRef.current = el;
          bgReveal.ref.current = el;
        }}
        style={{ background: showcaseBg(bgTour) }}
        aria-hidden
      />
      <div className="vs-morph-ghost" ref={ghostRef} aria-hidden />
      <div className="vs-scrim" aria-hidden />

      <div className="vs-inner">
        <div ref={copyReveal.ref} className={`vs-copy ${copyReveal.className}`}>
          <p className="eyebrow vs-eyebrow">Seven private-tour destinations</p>

          <div className="vs-headline">
            {leavingTour && <SliderHeadline tour={leavingTour} leaving />}
            <SliderHeadline key={tour.id} tour={tour} />
          </div>

          <p className="vs-blurb">{tour.blurb}</p>

          <div className="vs-cta-row">
            <button
              type="button"
              className="btn btn-primary vs-cta btn-shine"
              onClick={() => setEnquiryTour(tour)}
            >
              Enquire about this tour <span className="btn-arrow">→</span>
            </button>
            <a href="#builder" className="btn btn-light vs-cta-secondary">
              Or build your own itinerary
            </a>
          </div>

          {tour.priceFromAdult != null && (
            <p className="vs-price">
              From <Price aud={tour.priceFromAdult} /> pp, adult
            </p>
          )}
        </div>

        <div
          ref={cardsReveal.ref}
          className={`vs-cards-wrap ${cardsReveal.className}`}
        >
          <SideCardTrack
            ref={sideTrackRef}
            tours={tours}
            activeIndex={index}
            onSelect={navigate}
          />
        </div>
      </div>

      <div className="vs-footer">
        <div className="vs-progress" aria-hidden>
          <div key={index} className="vs-progress-fill" />
        </div>
        <p className="vs-counter mono" aria-hidden>
          {String(index + 1).padStart(2, "0")} / {String(tours.length).padStart(2, "0")}
        </p>
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
