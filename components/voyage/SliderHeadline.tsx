import type { ShowcaseTour } from "@/lib/showcase";

function Line({
  text,
  className,
  delay,
  leaving,
}: {
  text: string;
  className: string;
  delay: number;
  leaving?: boolean;
}) {
  return (
    <span
      className={`vs-line ${className} ${leaving ? "vs-line-out" : "vs-line-in"}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {text}
    </span>
  );
}

/**
 * One destination's headline block (name over region), wiped in or out via
 * clip-path, each line staggered slightly after the one above it. Rendered
 * twice by VoyageSlider during a transition — once `leaving` (the outgoing
 * tour, wiping shut) stacked under once entering (the incoming tour, wiping
 * open) — so the old copy visibly hands off to the new rather than swapping.
 */
export default function SliderHeadline({
  tour,
  leaving,
}: {
  tour: ShowcaseTour;
  leaving?: boolean;
}) {
  return (
    <div className={`vs-head-block ${leaving ? "vs-head-leaving" : ""}`} aria-hidden={leaving}>
      <Line text={tour.name} className="vs-title" delay={leaving ? 0 : 0.22} leaving={leaving} />
      <Line
        text={tour.region}
        className="vs-caption"
        delay={leaving ? 0.08 : 0.34}
        leaving={leaving}
      />
    </div>
  );
}
