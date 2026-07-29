"use client";

import { useReveal } from "./useReveal";

type Chapter = {
  num: string;
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  label: string;
};

const CHAPTERS: Chapter[] = [
  {
    num: "01",
    eyebrow: "Your guide",
    title: "Not just any old guide",
    body: "What sets us apart is that your guide is also your chef — and a qualified one at that. With culinary expertise guiding your experience, you can trust that each bite complements your wine tastings flawlessly. Your chef takes pride in crafting menus that enhance the incredible local vintages you'll sample.",
    image: "/images/jimmy.webp",
    label: "Jimmy, your chef & guide",
  },
  {
    num: "02",
    eyebrow: "The vineyards",
    title: "Three, hand-picked for you",
    body: "We've hand-picked three vineyards so you can take your time enjoying the food and wine on offer at a relaxed pace. There's plenty of time to soak up the beautiful scenery as we journey from location to location — and we know you'll love the three we've chosen for you.",
    image: "/images/Hunter-Valley-Tour-image-3.jpg",
    label: "Vineyard scenery",
  },
  {
    num: "03",
    eyebrow: "The wine",
    title: "World-class, and proud of it",
    body: "We're proud to be in the Hunter Valley food and wine tour business, and committed to learning everything we can about the region to build our expertise. We love taking guests to our favourite locations to explore and experience what we've come to know as world-class wine.",
    image: "/images/Hunter-Valley-Tour-image-4.jpg",
    label: "Cellar door tasting",
  },
  {
    num: "04",
    eyebrow: "Hunter Valley food",
    title: "Cooked for every palate",
    body: "As fellow food and wine lovers, we know connoisseurs and Hunter Valley debutantes alike have different needs. If you have any special dietary requirements, we'll do our utmost to accommodate them.",
    image: "/images/creme-brulee-and-white-wine-1024x439-1.jpg",
    label: "Chef-cooked lunch",
  },
];

function ChapterRow({ chapter }: { chapter: Chapter }) {
  const reveal = useReveal<HTMLDivElement>("chapter");
  return (
    <div ref={reveal.ref} className={reveal.className}>
      <div
        className="ch-media"
        style={{ backgroundImage: `url(${chapter.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <span>{chapter.label}</span>
      </div>
      <div className="ch-text">
        <span className="ch-num">{chapter.num}</span>
        <span className="eyebrow">{chapter.eyebrow}</span>
        <h3>{chapter.title}</h3>
        <p>{chapter.body}</p>
      </div>
    </div>
  );
}

export default function StoryChapters() {
  return (
    <div className="chapters">
      {CHAPTERS.map((c) => (
        <ChapterRow key={c.num} chapter={c} />
      ))}
    </div>
  );
}
