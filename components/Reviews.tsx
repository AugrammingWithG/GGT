import { TESTIMONIALS, type Testimonial } from "@/lib/testimonials";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="stars" aria-label={`Rated ${rating} out of 5`}>
      {"★★★★★".split("").map((s, i) => (
        <span key={i} aria-hidden="true">
          {s}
        </span>
      ))}
    </div>
  );
}

function ReviewCard({
  review,
  clone,
}: {
  review: Testimonial;
  /** Marks the duplicated half of the loop, which screen readers should skip. */
  clone?: boolean;
}) {
  return (
    <figure className="review-card" aria-hidden={clone || undefined}>
      <Stars rating={review.rating} />
      <blockquote>&ldquo;{review.quote}&rdquo;</blockquote>
      <figcaption>
        <b>{review.author}</b>
        <span className="review-source">via {review.source}</span>
      </figcaption>
    </figure>
  );
}

/**
 * All five of the site's real, owner-approved Tripadvisor reviews, running as a
 * horizontal marquee. The list is rendered twice so the loop can reset at the
 * halfway point without a visible jump; the second copy is decorative, so it's
 * kept out of the accessibility tree. Hovering or tabbing in pauses the scroll,
 * and prefers-reduced-motion swaps the whole thing for a manual scroller.
 */
export default function Reviews() {
  const reviews = TESTIMONIALS;

  return (
    <div className="review-marquee">
      <div className="review-track">
        {reviews.map((r, i) => (
          <ReviewCard key={`a-${i}-${r.title}`} review={r} />
        ))}
        {reviews.map((r, i) => (
          <ReviewCard key={`b-${i}-${r.title}`} review={r} clone />
        ))}
      </div>
    </div>
  );
}
