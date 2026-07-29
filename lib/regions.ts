export type RegionDestination = {
  name: string;
  highlights: string;
};

/**
 * A region card's single photo. `bg` is the CSS gradient fallback; `image`
 * layers a photo over it, same swap-in-place pattern as `lib/showcase.ts`.
 * `label` renders as a small on-photo caption naming the shot.
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
  /** Full destination + highlight list — used on /private-tours and /faq. */
  destinations: RegionDestination[];
  /** Short place names for the homepage card's condensed one-line summary. */
  summary: string[];
  photo: RegionPhoto;
};

/** The private-tour destinations, grouped by direction from Sydney. */
export const REGIONS: Region[] = [
  {
    id: "north",
    direction: "North",
    arrow: "↑",
    title: "Wine country & the coast",
    photo: {
      label: "Oyster shucking",
      bg: "linear-gradient(150deg,#cdbfa0,#5b4d34)",
      image: "/images/tours/central-coast.webp",
    },
    summary: ["Hunter Valley", "Central Coast", "Hawkesbury River", "Port Stephens"],
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
    photo: {
      label: "Seafood by the beach",
      bg: "linear-gradient(150deg,#8fb3c9,#2e4a56)",
      image: "/images/ggt-pictures/sydney-beaches-tour.jpg",
    },
    summary: ["Sydney City", "Fish Markets", "Beaches"],
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
    photo: {
      label: "Three Sisters, Blue Mountains",
      bg: "linear-gradient(150deg,#7d93a3,#2c3a42)",
      image: "/images/AdobeStock_204510460.jpeg",
    },
    summary: ["Blue Mountains", "Hawkesbury", "Oberon"],
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
    photo: {
      label: "Sea Cliff Bridge",
      bg: "linear-gradient(150deg,#6ea3a0,#233d3b)",
      image: "/images/tours/sea-cliff-bridge.webp",
    },
    summary: ["Royal National Park", "Sea Cliff Bridge", "Kiama"],
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
