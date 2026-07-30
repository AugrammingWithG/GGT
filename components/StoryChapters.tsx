"use client";

import type { ReactNode } from "react";

import { useReveal } from "./useReveal";

type Chapter = {
  title: string;
  /** One <p> per entry — the original site's copy, kept paragraph-for-paragraph. */
  body: string[];
  image: string;
  /** Removes the transparent frame baked into the supplied PNG exports. */
  framedImage?: boolean;
  /** The photos are CSS backgrounds, so this is the accessible name (role="img"). */
  alt: string;
};

const CHAPTERS: Chapter[] = [
  {
    title: "Your Hunter Valley Tour Guide",
    body: [
      "What sets us apart from the rest is that your guide is not just any old guide – he is also your chef, and a qualified one at that!",
      "With culinary expertise guiding your experience, you can trust that each bite will complement your wine tastings flawlessly. Your chef takes pride in crafting menus that enhance the incredible local vintages you'll sample.",
    ],
    image: "/images/jimmy.webp",
    alt: "Jimmy, your chef and guide, in a Hunter Valley vineyard",
  },
  {
    title: "The Vineyards",
    body: [
      "We have hand picked 3 vineyards for you to visit so you can take your time enjoying the food and wine on offer at a relaxed pace. There is plenty of time to enjoy the beautiful scenery as we journey from location to location, and you will love the 3 vineyards we have chosen for you. As fellow food and wine lovers, we know that food and wine connoisseurs and Hunter Valley debutantes alike have different needs. If you have any special dietary requirements, we will do our utmost to accommodate them.",
    ],
    image: "/images/3.png",
    framedImage: true,
    alt: "Rows of vines across a Hunter Valley vineyard",
  },
  {
    title: "The Wine",
    body: [
      "We are very proud to be in the Hunter Valley food and wine tour business. We are committed to learning everything we can about the region so we can build our expertise in our trade.",
      "We love taking our customers to our favourite locations to explore and experience what we have come to learn to be world-class wine.",
    ],
    image: "/images/2_e4c93c.png",
    framedImage: true,
    alt: "Wine being poured at a Hunter Valley cellar door",
  },
  {
    title: "Hunter Valley Food",
    body: [
      "As fellow food and wine lovers, we know that food and wine connoisseurs and Hunter Valley debutantes alike have different needs. If you have any special dietary requirements, we will do our utmost to accommodate them.",
    ],
    image: "/images/4.png",
    framedImage: true,
    alt: "Crème brûlée served with a glass of white wine",
  },
];

function ChapterMedia({ chapter, order }: { chapter: Chapter; order: number }) {
  const reveal = useReveal<HTMLDivElement>("ch-media");
  return (
    <div
      ref={reveal.ref}
      className={`${reveal.className}${chapter.framedImage ? " ch-media--framed" : ""}`}
      role="img"
      aria-label={chapter.alt}
      style={{ backgroundImage: `url(${chapter.image})`, order }}
    />
  );
}

function ChapterText({ chapter, order }: { chapter: Chapter; order: number }) {
  const reveal = useReveal<HTMLDivElement>("ch-text");
  return (
    <div ref={reveal.ref} className={reveal.className} style={{ order }}>
      <h3>{chapter.title}</h3>
      {chapter.body.map((para) => (
        <p key={para.slice(0, 32)}>{para}</p>
      ))}
    </div>
  );
}

export default function StoryChapters() {
  // Dealt into two columns that pack independently (see .ch-col) rather than
  // into shared rows — that's what staggers the photos against the copy.
  // Photo leads the left column on even chapters, the copy leads on odd ones,
  // so the two alternate down the page.
  //
  // `order` is the flat photo-then-copy sequence, chapter by chapter. It's a
  // no-op on desktop (each column's values already ascend) and only bites at
  // <=900px, where .ch-col goes display:contents and the blocks have to
  // re-interleave themselves into a single stack.
  const left: ReactNode[] = [];
  const right: ReactNode[] = [];

  CHAPTERS.forEach((chapter, i) => {
    const media = (
      <ChapterMedia key={`${chapter.title}-media`} chapter={chapter} order={i * 2} />
    );
    const text = (
      <ChapterText key={`${chapter.title}-text`} chapter={chapter} order={i * 2 + 1} />
    );
    if (i % 2 === 0) {
      left.push(media);
      right.push(text);
    } else {
      left.push(text);
      right.push(media);
    }
  });

  return (
    <div className="chapters">
      <div className="ch-col">{left}</div>
      <div className="ch-col">{right}</div>
    </div>
  );
}
