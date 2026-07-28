import { TESTIMONIALS } from "@/lib/testimonials";

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

/** All five of the site's real, owner-approved Tripadvisor reviews. */
export default function Reviews() {
  const reviews = TESTIMONIALS;

  return (
    <div className="review-grid">
      {reviews.map((r) => (
        <figure key={r.title} className="review-card">
          <Stars rating={r.rating} />
          <blockquote>&ldquo;{r.quote}&rdquo;</blockquote>
          <figcaption>
            <b>{r.author}</b>
            <span className="review-source">via {r.source}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
