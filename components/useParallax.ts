"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-linked drift: sets `--py` on the returned ref's element to how far
 * its centre sits from the viewport's centre (in px, scaled by `strength`,
 * negated so content drifts the way a background layer would — slower/
 * opposite the foreground scroll). Consumers read it back with
 * `translate:0 var(--py,0px)` wherever they want the effect; nothing is
 * applied here beyond the custom property, so it composes with whatever
 * `transform` the element already uses.
 *
 * One scroll/resize listener per instance, rAF-batched so a fast scroll
 * only recomputes once a frame rather than once per event. Off entirely
 * under prefers-reduced-motion, matching every other motion effect on the
 * site (see HunterHero's cursor parallax).
 */
export function useParallax<T extends HTMLElement>(strength = 24) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // -1 (centred above the viewport) .. 0 (dead centre) .. +1 (below).
      const progress = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.setProperty("--py", `${(-progress * strength).toFixed(2)}px`);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [strength]);

  return ref;
}
