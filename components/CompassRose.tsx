"use client";

import { useEffect, useRef } from "react";

/**
 * Purely decorative — the four region cards below already state their
 * direction in accessible text, so this is hidden from assistive tech.
 *
 * The wine-coloured needle tracks the cursor everywhere on the page, like a
 * real compass pointing at you; the ring, ticks and N/E/S/W labels are the
 * fixed housing and never move. The needle's transform is written straight
 * to the DOM each animation frame (no React state, no CSS transition) so it
 * snaps to the cursor with zero extra lag. Skipped entirely under
 * prefers-reduced-motion, where the needle just rests pointing North.
 */
export default function CompassRose() {
  const svgRef = useRef<SVGSVGElement>(null);
  const needleRef = useRef<SVGGElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function update() {
      frame.current = null;
      const svg = svgRef.current;
      const needle = needleRef.current;
      if (!svg || !needle) return;
      const rect = svg.getBoundingClientRect();
      const dx = pointer.current.x - (rect.left + rect.width / 2);
      const dy = pointer.current.y - (rect.top + rect.height / 2);
      const angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
      needle.style.transform = `rotate(${angle}deg)`;
    }

    function handleMove(e: MouseEvent) {
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
      if (frame.current === null) {
        frame.current = requestAnimationFrame(update);
      }
    }

    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="compass-rose"
      width="110"
      height="110"
      viewBox="0 0 120 120"
      aria-hidden="true"
    >
      <circle cx="60" cy="60" r="52" fill="none" stroke="var(--line)" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="36" fill="none" stroke="var(--line)" strokeWidth="1" strokeDasharray="2 4" />
      <circle cx="60" cy="60" r="3.5" fill="var(--gold-muted)" />

      {/* North — fixed housing tick, same style as E/S/W, tip points up */}
      <line x1="60" y1="60" x2="60" y2="18" stroke="var(--ink-soft)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M60 10 L66 22 L54 22 Z" fill="var(--ink-soft)" />
      <text x="60" y="10" textAnchor="middle" className="compass-label">N</text>

      {/* Needle — the only part that moves; rests pointing North (0deg). */}
      <g ref={needleRef} className="compass-needle" style={{ transformOrigin: "60px 60px" }}>
        <line x1="60" y1="60" x2="60" y2="18" stroke="var(--wine)" strokeWidth="2" strokeLinecap="round" />
        <path d="M60 10 L66 22 L54 22 Z" fill="var(--wine)" />
      </g>

      {/* East — tip points right (larger x) */}
      <line x1="60" y1="60" x2="98" y2="60" stroke="var(--ink-soft)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M106 60 L96 66 L96 54 Z" fill="var(--ink-soft)" />
      <text x="112" y="64" textAnchor="middle" className="compass-label">E</text>

      {/* South — tip points down (larger y) */}
      <line x1="60" y1="60" x2="60" y2="98" stroke="var(--ink-soft)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M60 106 L54 96 L66 96 Z" fill="var(--ink-soft)" />
      <text x="60" y="112" textAnchor="middle" className="compass-label">S</text>

      {/* West — tip points left (smaller x) */}
      <line x1="60" y1="60" x2="22" y2="60" stroke="var(--ink-soft)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 60 L24 54 L24 66 Z" fill="var(--ink-soft)" />
      <text x="8" y="64" textAnchor="middle" className="compass-label">W</text>
    </svg>
  );
}
