"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";
import { gsap } from "gsap";
import { showcaseBg, type ShowcaseTour } from "@/lib/showcase";

// Padding clones either side so the track always has real-looking cards to
// show mid-animation past either end; see the settle-snap in the effect
// below, which is the same "loop forever on a finite array" trick
// DestinationGallery uses for its own track, just driven by index props
// instead of native scroll.
const CLONE = 3;

function circularDelta(from: number, to: number, len: number) {
  let d = (to - from) % len;
  if (d > len / 2) d -= len;
  if (d < -len / 2) d += len;
  return d;
}

export type SideCardTrackHandle = {
  /**
   * Rect of the card that's about to become active — the leftmost one
   * currently visible in the rail. Lets autoplay play the same card-zoom
   * morph a click would, even though nothing was clicked.
   */
  getUpcomingRect: () => DOMRect | null;
};

/**
 * The right-hand rail of upcoming destinations: one shared flex track that
 * slides as a whole (a single gsap tween on the track's x, not per-card
 * transitions) whenever the hero's active slide changes, so the cards read
 * as one filmstrip moving past a window rather than independent elements.
 * Always shows the destinations *after* the active one; clicking a card
 * jumps the hero straight to it.
 */
export default forwardRef<
  SideCardTrackHandle,
  {
    tours: ShowcaseTour[];
    activeIndex: number;
    onSelect: (i: number, fromRect: DOMRect) => void;
  }
>(function SideCardTrack({ tours, activeIndex, onSelect }, ref) {
  const extended = [...tours.slice(-CLONE), ...tours, ...tours.slice(0, CLONE)];
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  // Extended-array index of the window's first (leftmost) visible card.
  // Continuous, not clamped: shortest-path deltas accumulate onto it and a
  // silent post-tween snap keeps it inside the clone padding.
  const domPos = useRef(CLONE + 1);
  const prevIndex = useRef(activeIndex);
  const stepRef = useRef(0);

  useImperativeHandle(
    ref,
    () => ({
      getUpcomingRect: () =>
        cardRefs.current[domPos.current]?.getBoundingClientRect() ?? null,
    }),
    [],
  );

  const measureStep = () => {
    const a = cardRefs.current[CLONE];
    const b = cardRefs.current[CLONE + 1];
    if (a && b) stepRef.current = b.offsetLeft - a.offsetLeft;
    return stepRef.current;
  };

  useLayoutEffect(() => {
    const step = measureStep();
    gsap.set(trackRef.current, { x: -(step * domPos.current) });
    const onResize = () => {
      const s = measureStep();
      gsap.set(trackRef.current, { x: -(s * domPos.current) });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // Only needs the initial measurement/listener; slide changes are handled
    // by the effect below, which reads the same ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeIndex === prevIndex.current) return;
    const delta = circularDelta(prevIndex.current, activeIndex, tours.length);
    prevIndex.current = activeIndex;
    domPos.current += delta;
    const step = stepRef.current || measureStep();

    gsap.to(trackRef.current, {
      x: -(step * domPos.current),
      duration: 0.9,
      ease: "power3.inOut",
      onComplete: () => {
        const logical = domPos.current - CLONE;
        if (logical < 0 || logical >= tours.length) {
          const wrapped = ((logical % tours.length) + tours.length) % tours.length;
          domPos.current = wrapped + CLONE;
          gsap.set(trackRef.current, { x: -(step * domPos.current) });
        }
      },
    });
  }, [activeIndex, tours.length]);

  return (
    <div className="vs-cards" aria-hidden={extended.length === 0}>
      <div className="vs-track" ref={trackRef}>
        {extended.map((t, i) => {
          const logical = ((i - CLONE) % tours.length + tours.length) % tours.length;
          return (
            <button
              type="button"
              key={`${t.id}-${i}`}
              className="vs-card"
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              style={{ background: showcaseBg(t) }}
              onClick={(e) => onSelect(logical, e.currentTarget.getBoundingClientRect())}
              aria-label={`Jump to ${t.name}`}
            >
              <span className="vs-card-overlay">
                <span className="vs-card-name">{t.name}</span>
                <span className="vs-card-region">{t.region}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});
