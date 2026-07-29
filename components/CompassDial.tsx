"use client";

import type { RefObject } from "react";

/** Clockwise, index-parallel to TARGET_DEG in ChooseDirection.tsx. */
export const DIRECTIONS = ["North", "East", "South", "West"] as const;
export type DirectionName = (typeof DIRECTIONS)[number];

/**
 * The interactive compass in the "choose a direction" section — the sibling of
 * CompassRose.tsx, which is the small decorative rose at the centre of the
 * dial below (#directions). Same geometry on purpose (0 0 120 120 viewBox,
 * 60,60 centre, matching ticks) so the page's two compasses read as one
 * instrument, but the behaviour is unrelated: that one chases the cursor with
 * a continuous angle, this one snaps between four fixed headings.
 *
 * Fully controlled — no state, no effects. All the timing and the angle
 * bookkeeping live in ChooseDirection.tsx so the needle and the photo
 * physically cannot drift apart.
 *
 * The SVG is decoration (`aria-hidden`); the N/E/S/W letters are real buttons
 * layered over it, because they have to be focusable, nameable and hoverable,
 * and a button outside the SVG picks up the global :focus-visible ring for
 * free.
 */
export default function CompassDial({
  angle,
  activeIndex,
  onPick,
  buttonsRef,
}: {
  /** Accumulated, never-wrapped needle rotation in degrees. */
  angle: number;
  activeIndex: number;
  onPick: (index: number) => void;
  /** Filled with the four buttons so arrow keys can move focus, not just selection. */
  buttonsRef: RefObject<(HTMLButtonElement | null)[]>;
}) {
  return (
    <>
      <svg className="choose-rose" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="54" fill="none" stroke="var(--line)" strokeWidth="1.5" />
        <circle cx="60" cy="60" r="38" fill="none" stroke="var(--line)" strokeWidth="1" strokeDasharray="2 5" />

        {/* Fixed housing ticks at the four headings — lighter than the rose
            below, where the letters are SVG <text> rather than buttons. */}
        <g stroke="var(--ink-soft)" strokeWidth="1.25" strokeLinecap="round" opacity=".8">
          <line x1="60" y1="14" x2="60" y2="24" />
          <line x1="106" y1="60" x2="96" y2="60" />
          <line x1="60" y1="106" x2="60" y2="96" />
          <line x1="14" y1="60" x2="24" y2="60" />
        </g>

        {/* Intercardinal minor ticks — flourish only. */}
        <g stroke="var(--line)" strokeWidth="1" strokeLinecap="round">
          {[45, 135, 225, 315].map((a) => (
            <line key={a} x1="60" y1="18" x2="60" y2="24" transform={`rotate(${a} 60 60)`} />
          ))}
        </g>

        {/* The only moving part. Two-tone like a magnetised card: wine head,
            faded tail. transformOrigin matches CompassRose.tsx exactly — px
            units resolve against the viewBox via the default
            transform-box:view-box, and the attribute form of rotate() can't
            be transitioned in Safari. */}
        <g
          className="choose-needle"
          style={{ transformOrigin: "60px 60px", transform: `rotate(${angle}deg)` }}
        >
          <path d="M60 20 L66.5 60 L60 66 L53.5 60 Z" fill="var(--wine)" />
          <path d="M60 100 L53.5 60 L60 54 L66.5 60 Z" fill="var(--ink-soft)" opacity=".4" />
        </g>

        <circle cx="60" cy="60" r="4" fill="var(--gold-muted)" />
        <circle cx="60" cy="60" r="1.6" fill="var(--paper)" />
      </svg>

      {DIRECTIONS.map((dir, i) => (
        <button
          key={dir}
          type="button"
          ref={(el) => {
            buttonsRef.current[i] = el;
          }}
          className={`choose-point choose-point-${dir[0].toLowerCase()}`}
          aria-label={dir}
          aria-pressed={i === activeIndex}
          onClick={() => onPick(i)}
        >
          {dir[0]}
        </button>
      ))}
    </>
  );
}
