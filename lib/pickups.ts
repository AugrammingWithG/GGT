export type PickupPoint = {
  name: string;
  time: string;
  lat: number;
  lng: number;
  /** Google Maps link for this exact spot, shown in the popup/list. */
  mapLink: string;
};

export type BasePoint = {
  name: string;
  address: string;
  lat: number;
  lng: number;
  mapLink: string;
};

/** Our depot — shown as a distinct marker alongside the CBD pickup pins. */
export const BUSINESS_BASE_POINT: BasePoint = {
  name: "Our base",
  address: "17 Allambie Rd, Allambie Heights NSW 2100",
  lat: -33.7630663,
  lng: 151.2469628,
  mapLink: "https://www.google.com/maps?q=17+Allambie+Rd,+Allambie+Heights+NSW+2100",
};

/**
 * Sydney CBD & Fish Market pickup points for the Hunter Valley tour, with the
 * same coordinates and times as the old site's pick-up map.
 */
export const PICKUP_POINTS: PickupPoint[] = [
  {
    name: "Four Seasons Hotel (back entrance, Harrington St)",
    time: "6:55am",
    lat: -33.8612466,
    lng: 151.2073942,
    mapLink: "https://goo.gl/maps/95xpAUEQkb32",
  },
  {
    name: "Meriton Suites, Sussex St",
    time: "7:00am",
    lat: -33.8722331,
    lng: 151.2043321,
    mapLink: "https://goo.gl/maps/3dkZ78E2mZxTfW337",
  },
  {
    name: "Metro Hotel Marlow Sydney Central",
    time: "6:35am",
    lat: -33.8791611,
    lng: 151.2068743,
    mapLink: "https://goo.gl/maps/nY7e4KTJtv22",
  },
  {
    name: "Rydges World Square, Pitt St",
    time: "6:40am",
    lat: -33.876965,
    lng: 151.207495,
    mapLink: "https://goo.gl/maps/s2E88CpTsPB2",
  },
  {
    name: "Sheraton Grand on the Park, Elizabeth St entrance",
    time: "6:40am",
    lat: -33.8715281,
    lng: 151.2098195,
    mapLink: "https://goo.gl/maps/Q1QXyzopd8E2",
  },
  {
    name: "Sofitel Wentworth, Phillip St",
    time: "6:45am",
    lat: -33.8653282,
    lng: 151.2108695,
    mapLink: "https://goo.gl/maps/cfJiQkieJBs",
  },
  {
    name: "Sydney Fish Market (outside Claudio's), drop-off in city",
    time: "7:10am",
    lat: -33.8726323,
    lng: 151.191765,
    mapLink: "https://goo.gl/maps/L1n6fKGwbo92",
  },
];
