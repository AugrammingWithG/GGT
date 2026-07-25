"use client";

import { useEffect, useRef } from "react";

/**
 * Site-wide replacement pointer: a dot that snaps straight to the cursor and
 * a ring that eases toward it a frame behind, so the pair reads as one
 * cursor with a little weight to it rather than a rigid OS arrow. Both use
 * `mix-blend-mode: difference` against white, which inverts to black on the
 * cream sections and stays white over the dark hero photos — one rule
 * instead of tracking every section's background colour by hand.
 *
 * Desktop-pointer only (a touch tap isn't "hovering") and skipped entirely
 * under prefers-reduced-motion, same gate HunterHero's own cursor parallax
 * uses. Mounted once from RootLayout so it follows the pointer across every
 * page, not just the home page.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("has-custom-cursor");

    // Target is the raw pointer position; the ring's rendered position
    // trails it via lerp in the rAF loop below, the dot is pinned to it.
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    let raf = 0;

    const isInteractive = (el: Element | null) =>
      !!el?.closest(
        'a, button, input, textarea, select, [role="button"], .btn, .dg-card',
      );

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      dot.style.transform = `translate(${targetX}px, ${targetY}px)`;
      ring.classList.toggle("is-hover", isInteractive(e.target as Element));
    };
    const onDown = () => ring.classList.add("is-down");
    const onUp = () => ring.classList.remove("is-down");
    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const onEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const tick = () => {
      // Ring eases a fraction of the remaining distance each frame — the
      // "weight" that makes it read as trailing the dot instead of glued to it.
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden />
    </>
  );
}
