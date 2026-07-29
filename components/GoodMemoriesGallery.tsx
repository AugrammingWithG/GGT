"use client";

import { useState } from "react";

export type GalleryPhoto = { src: string; caption: string; position?: string };

const SLOTS = ["m1", "m2", "m3", "m4", "m5"] as const;
const PER_PAGE = SLOTS.length;

/**
 * Fixed 5-tile mosaic (one wide tile, four portrait/square) that pages
 * through the full photo set — the same slot template every page, just
 * the photos rotating through it.
 */
export default function GoodMemoriesGallery({ photos }: { photos: GalleryPhoto[] }) {
  const pages = Math.max(1, Math.ceil(photos.length / PER_PAGE));
  const [page, setPage] = useState(0);

  const start = page * PER_PAGE;
  const shown = photos.slice(start, start + PER_PAGE);

  return (
    <div className="gm-card">
      <div className="gm-head">
        <span className="eyebrow">Postcards from the road</span>
        <h2>Gallery of Good Memories</h2>
      </div>

      <div className="gm-mosaic">
        {shown.map((p, i) => (
          <div
            key={p.src}
            className={`gm-tile ${SLOTS[i]}`}
            style={{
              backgroundImage: `url(${p.src})`,
              backgroundPosition: p.position ?? "center",
            }}
          >
            <span className="gm-tag">{p.caption}</span>
          </div>
        ))}
      </div>

      {pages > 1 && (
        <div className="gm-pager">
          <button
            type="button"
            aria-label="Previous photos"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            ‹
          </button>
          <span>{page + 1} / {pages}</span>
          <button
            type="button"
            aria-label="Next photos"
            onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
            disabled={page === pages - 1}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
