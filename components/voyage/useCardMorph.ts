"use client";

import { useCallback, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { showcaseBg, type ShowcaseTour } from "@/lib/showcase";

/**
 * Drives the "small card zooms into the background" transition: a ghost
 * clone of the clicked (or upcoming, for autoplay) card's photo is sized and
 * positioned to match its on-screen rect exactly, then tweened — transform
 * only, so it's cheap — up to the full-bleed `vs-bg` box. The card visually
 * *becomes* the new backdrop instead of crossfading or warping into it.
 *
 * Coordinates are computed relative to `sectionRef` (not the viewport) so the
 * ghost, which is absolutely positioned inside that section, lines up with
 * `getBoundingClientRect()` rects taken from elsewhere in the same section.
 */
export function useCardMorph(
  sectionRef: RefObject<HTMLElement | null>,
  bgRef: RefObject<HTMLDivElement | null>,
) {
  const ghostRef = useRef<HTMLDivElement>(null);

  const play = useCallback(
    (fromRect: DOMRect, tour: ShowcaseTour, onCovered: () => void) => {
      const ghost = ghostRef.current;
      const bg = bgRef.current;
      const section = sectionRef.current;
      if (!ghost || !bg || !section) {
        onCovered();
        return;
      }

      const sec = section.getBoundingClientRect();
      const target = bg.getBoundingClientRect();
      const from = { left: fromRect.left - sec.left, top: fromRect.top - sec.top };
      const to = { left: target.left - sec.left, top: target.top - sec.top };

      gsap.killTweensOf(ghost);
      ghost.style.background = showcaseBg(tour);
      gsap.set(ghost, {
        opacity: 1,
        width: target.width,
        height: target.height,
        x: from.left,
        y: from.top,
        scaleX: fromRect.width / target.width,
        scaleY: fromRect.height / target.height,
        borderRadius: "16px",
        transformOrigin: "0 0",
      });
      gsap.to(ghost, {
        x: to.left,
        y: to.top,
        scaleX: 1,
        scaleY: 1,
        borderRadius: "0px",
        duration: 1,
        ease: "power3.inOut",
        onComplete: () => {
          // Swap the real background in first, then hide the ghost a frame
          // later so the hand-off happens after React has painted the new
          // image underneath — otherwise a state-update tick can land after
          // the ghost's already gone, flashing the old photo for a frame.
          onCovered();
          requestAnimationFrame(() => {
            requestAnimationFrame(() => gsap.set(ghost, { opacity: 0 }));
          });
        },
      });
    },
    [bgRef, sectionRef],
  );

  return { ghostRef, play };
}
