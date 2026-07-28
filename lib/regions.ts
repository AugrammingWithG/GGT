export type RegionDestination = {
  name: string;
  highlights: string;
};

/**
 * One photo in a region card's editorial split. `bg` is the CSS gradient
 * fallback; `image` layers a photo over it, same swap-in-place pattern as
 * `lib/showcase.ts`. `label` always renders as a small on-photo caption —
 * it's the placeholder marker, naming the shot each slot still needs.
 *
 * Every region below already points `image` at the closest existing shot in
 * `public/images/` as a stand-in — none were taken for this exact spot, so
 * treat every one as a placeholder regardless. Swap `image` for Jimmy's real
 * photo of the labelled subject when it's ready, and drop that `label` line
 * in RegionCard.tsx at the same time.
 */
export type RegionPhoto = {
  label: string;
  bg: string;
  image?: string;
  focus?: string;
};

export type Region = {
  id: string;
  direction: "North" | "East" | "West" | "South";
  /** Decorative — the accessible direction name is `direction` above. */
  arrow: string;
  title: string;
  destinations: RegionDestination[];
  /** [large top photo, smaller inset photo] for the card's editorial split. */
  photos: [RegionPhoto, RegionPhoto];
};

/** The private-tour destinations, grouped by direction from Sydney. */
export const REGIONS: Region[] = [
  {
    id: "north",
    direction: "North",
    arrow: "↑",
    title: "Wine country & the coast",
    photos: [
      {
        label: "Oyster shucking",
        bg: "linear-gradient(150deg,#cdbfa0,#5b4d34)",
        image: "/images/tours/central-coast.webp",
      },
      {
        label: "Hunter Valley vineyard",
        bg: "linear-gradient(150deg,#8a9b5e,#3c4326)",
        image: "/images/tours/kangaroo-valley.webp",
        focus: "72% center",
      },
    ],
    destinations: [
      { name: "Hunter Valley", highlights: "wine, chocolate & cheese" },
      {
        name: "Central Coast",
        highlights:
          "distillery, chocolate factory, pelicans, animal park, oyster & pea farms",
      },
      { name: "Hawkesbury River", highlights: "the historic Riverboat Postman run" },
      {
        name: "Port Stephens",
        highlights: "dolphin & whale watching, sandboarding, 4WD dune rides",
      },
    ],
  },
  {
    id: "east",
    direction: "East",
    arrow: "→",
    title: "City & beaches",
    photos: [
      {
        label: "Sydney beaches",
        bg: "linear-gradient(150deg,#8fb3c9,#2e4a56)",
        image: "/images/ggt-pictures/sydney-beaches-tour.jpg",
      },
      {
        label: "Market food stop",
        bg: "linear-gradient(150deg,#c98a5e,#5c3a26)",
        image: "/images/ggt-pictures/beaches-bbq.jpg",
      },
    ],
    destinations: [
      {
        name: "Sydney City",
        highlights:
          "Fish Market, Harbour Bridge pylon climb or bridge walk, The Rocks, Botanic Gardens",
      },
      {
        name: "The beaches",
        highlights:
          "Bondi coastal walk, Manly, breweries, Watsons Bay, Palm Beach lighthouse walk, North Head",
      },
    ],
  },
  {
    id: "west",
    direction: "West",
    arrow: "←",
    title: "Mountains & highlands",
    photos: [
      {
        label: "Blue Mountains lookout",
        bg: "linear-gradient(150deg,#7d93a3,#2c3a42)",
        image: "/images/AdobeStock_204510460.jpeg",
      },
      {
        label: "Cellar door tasting",
        bg: "linear-gradient(150deg,#8a6a4a,#3a2a1a)",
        image: "/images/tours/hunter.webp",
      },
    ],
    destinations: [
      {
        name: "Hawkesbury",
        highlights: "vineyards, cider tasting, distillery, fruit picking",
      },
      {
        name: "Blue Mountains",
        highlights:
          "Scenic World, bushwalks, Three Sisters, wildlife park, a vineyard stop",
      },
      { name: "Oberon", highlights: "truffle hunt, Jenolan Caves, Mayfield Gardens" },
    ],
  },
  {
    id: "south",
    direction: "South",
    arrow: "↓",
    title: "Coast & national park",
    photos: [
      {
        label: "Royal National Park bushwalk",
        bg: "linear-gradient(150deg,#7a8f6e,#33402c)",
        image: "/images/tours/beaches.webp",
      },
      {
        label: "South Coast waterfall",
        bg: "linear-gradient(150deg,#6ea3a0,#233d3b)",
        image: "/images/ggt-pictures/blue-mountains-1.jpg",
      },
    ],
    destinations: [
      {
        name: "Royal National Park",
        highlights: "bushwalking, kayaking & swimming",
      },
      { name: "Sea Cliff Bridge", highlights: "the clifftop ocean drive" },
      {
        name: "Coastal highlights",
        highlights: "the blowhole and lookouts along the way",
      },
    ],
  },
];
