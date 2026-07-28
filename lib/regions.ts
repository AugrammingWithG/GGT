export type RegionDestination = {
  name: string;
  highlights: string;
};

export type Region = {
  id: string;
  direction: "North" | "East" | "West" | "South";
  /** Decorative — the accessible direction name is `direction` above. */
  arrow: string;
  title: string;
  destinations: RegionDestination[];
};

/** The private-tour destinations, grouped by direction from Sydney. */
export const REGIONS: Region[] = [
  {
    id: "north",
    direction: "North",
    arrow: "↑",
    title: "Wine country & the coast",
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
