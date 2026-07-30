"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CompassDial, { DIRECTIONS } from "@/components/CompassDial";
import { mediaBg } from "@/lib/media";

/** Index-parallel to DIRECTIONS. SVG rotate() is clockwise and the needle rests up. */
const TARGET_DEG = [0, 90, 180, 270];
const CYCLE_MS = 4000;

/** The one fixed photo beside the compass — no longer swapped per direction. */
const PHOTO_BG = mediaBg(
  "linear-gradient(150deg,#7d93a3,#2c3a42)",
  "/images/couple-cliff-lookout.jpg",
);

/**
 * Shortest signed rotation from the currently-applied (unwrapped) angle to a
 * heading, in (-180, 180].
 *
 * Adding this to a running total — never normalising the total back into
 * 0-360 — is what stops the needle unwinding 270deg backwards on West ->
 * North: from 270 the delta to North is +90, so the total goes 270 -> 360 and
 * the needle keeps turning the way it was already going. Exactly 180 stays
 * positive so a click that skips a step (North -> South) turns clockwise,
 * matching the autoplay direction.
 *
 * The total therefore drifts monotonically — about 81,000deg after an hour of
 * continuous cycling. That is nowhere near a float64 precision concern, so
 * resist "fixing" it with a % 360; that reintroduces the unwind.
 */
function shortestDelta(from: number, to: number): number {
  let d = (to - from) % 360;
  if (d > 180) d -= 360;
  if (d <= -180) d += 360;
  return d;
}

/**
 * The compass narrative that hands straight off into the region dial below
 * (#directions): copy left, a fixed photo right, and an interactive compass
 * under the copy.
 *
 * The needle steps N -> E -> S -> W on a timer purely as a decorative/pick
 * affordance — it no longer drives what the photo shows. Hovering the compass
 * or the photo pauses the cycle, focusing it pauses it, and picking a
 * direction pins it for good — a deliberate choice shouldn't get yanked away
 * four seconds later. All four gates plus prefers-reduced-motion feed one
 * interval; see the effect below.
 */
export default function ChooseDirection() {
  // index and angle move together in one update: derive one from the other in
  // an effect and the needle can end up pointing at the wrong heading.
  const [{ index, angle }, setDial] = useState({ index: 0, angle: 0 });
  const [pinned, setPinned] = useState(false);
  const [hovering, setHovering] = useState(false);
  // Tracked apart from `hovering`: mousing out of the dial while it still has
  // keyboard focus must not restart the cycle under the visitor.
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [inView, setInView] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const goTo = useCallback((next: number) => {
    setDial((s) => ({
      index: next,
      angle: s.angle + shortestDelta(s.angle, TARGET_DEG[next]),
    }));
  }, []);

  const pick = useCallback(
    (next: number) => {
      setPinned(true);
      goTo(next);
    },
    [goTo],
  );

  // Gates a running timer, so unlike CompassRose's one-shot read this stays
  // subscribed — a visitor can flip the OS setting mid-visit.
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  // This sits near the top of a very long page; without this it would keep
  // ticking for the whole visit. Not useReveal() — that hook unobserves after
  // the first hit by design, and we need to know when the section leaves
  // again.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.25,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || pinned || hovering || focused || !inView) return;
    // Functional updater, so a tick never rebuilds the interval — only the
    // four gates above do. Cleanup is unconditional, which is what keeps
    // StrictMode's dev double-mount from running two of these at once.
    const id = window.setInterval(() => {
      setDial((s) => {
        const next = (s.index + 1) % DIRECTIONS.length;
        return {
          index: next,
          angle: s.angle + shortestDelta(s.angle, TARGET_DEG[next]),
        };
      });
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [reduced, pinned, hovering, focused, inView]);

  function handleKeyDown(e: React.KeyboardEvent) {
    const delta =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (index + delta + DIRECTIONS.length) % DIRECTIONS.length;
    pick(next);
    buttonsRef.current[next]?.focus();
  }

  return (
    <section className="choose-section" id="choose" ref={sectionRef}>
      <div className="wrap">
        <span className="choose-eyebrow">Make it personal</span>
        <div className="choose-grid">
          <div className="choose-copy">
            <h2>Now choose your own adventure</h2>
            <p>Private tours for 2 guests and above — pick a direction to begin.</p>
          </div>

          <div
            className="choose-dial"
            role="group"
            aria-label="Choose a direction"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            // React's onFocus/onBlur are backed by focusin/focusout and do
            // bubble, so this one pair covers all four buttons.
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKeyDown}
          >
            <CompassDial
              angle={angle}
              activeIndex={index}
              onPick={pick}
              buttonsRef={buttonsRef}
            />
          </div>

          <figure
            className="choose-photo"
            style={{ background: PHOTO_BG }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          />
        </div>
      </div>
    </section>
  );
}
