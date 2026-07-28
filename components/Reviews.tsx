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

/** Three of the site's real, owner-approved Tripadvisor reviews, one per guest. */
export default function Reviews() {
  const seen = new Set<string>();
  const reviews = TESTIMONIALS.filter((r) => {
    if (seen.has(r.author)) return false;
    seen.add(r.author);
    return true;
  }).slice(0, 3);

  return (
    <div className="review-grid">
      {reviews.map((r) => (
        <figure key={r.author} className="review-card">
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
