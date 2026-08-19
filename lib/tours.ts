export type AddOn = {
  id: string;
  name: string;
  /**
   * Per-person price in AUD. On a `payOnDay` extra this is the third party's
   * approximate gate price, shown as a guide only; `0` there means "price
   * varies" and is displayed as words rather than as a number. On a regular
   * (non-`payOnDay`) extra, `0` means genuinely free/included, and `undefined`
   * means no price has been confirmed yet — never invent a number for this
   * case, leave the field out and it displays as "Price on request".
   */
  price?: number;
  /**
   * True for a third-party cost the guest pays direct on the day — a ticket
   * booth, a hire counter — rather than money we collect.
   *
   * These are never added to a quoted total. Charging for them would mean
   * taking payment on someone else's behalf, so the split is enforced here in
   * the data model and honoured by `tourTotal`, which is the only place a
   * total is worked out.
   */
  payOnDay?: boolean;
  /** True when the extra can't always be delivered (e.g. seasonal/weather-dependent) and should be flagged as such. */
  subjectToAvailability?: boolean;
  /** Short qualifier shown under the name, e.g. "Includes shucking and tasting" or "Mornings only". */
  note?: string;
};

/**
 * Guest cap for a tour with none set: the 16-seat bus, which every tour
 * currently runs on. Kept only as the fallback for tour records written
 * before `max` existed; the real limit lives on each tour, so a second,
 * smaller vehicle just means a lower `max` on the tours that use it.
 */
export const DEFAULT_MAX_GUESTS = 16;

export type PrivateTourRate = {
  base: number;
  baseCoversMin: number;
  baseCoversMax: number;
  extraGuestPrice: number;
  maxGuests: number;
  includes: string[];
};

/**
 * Shared pricing model for every private tour (every tour except Hunter
 * Valley). Seed/fallback default — the live value is the `settings/pricing`
 * Firestore doc (see lib/tours.server.ts's getPrivateTourRate), editable from
 * the admin Pricing tab. Kept here as the same seed/fallback role SEED_TOURS
 * plays for tours: what a fresh Firestore project starts from, and what's
 * used if the settings doc is missing or unreachable.
 */
export const PRIVATE_TOUR_RATE: PrivateTourRate = {
  base: 2300,
  baseCoversMin: 2,
  baseCoversMax: 4,
  extraGuestPrice: 200,
  maxGuests: 16,
  includes: ["Guide", "Bus", "Lunch"],
};

/**
 * The private-tour estimate shown in the booking widget: the base fare plus
 * $extraGuestPrice for each guest beyond baseCoversMax. Guest counts at or
 * under baseCoversMax pay the flat base regardless of party size.
 */
export function privateTourEstimate(rate: PrivateTourRate, guests: number): number {
  const extra = Math.max(0, guests - rate.baseCoversMax);
  return rate.base + extra * rate.extraGuestPrice;
}

export type Tour = {
  id: string;
  name: string;
  /** Hunter Valley only: its own per-person adult rate. */
  priceAdult?: number;
  /** Hunter Valley only: its own per-person senior rate. */
  priceSenior?: number;
  /** Hunter Valley only: its own per-person child/student (4-16) rate. */
  priceChild?: number;
  /** Absent where group size is negotiated per private tour rather than fixed. */
  min?: number;
  /** Most guests this tour can take: the capacity of the vehicle it runs on. */
  max: number;
  addOns: AddOn[];
  /** Optional display order in the builder dropdown. */
  order?: number;
  /**
   * Bókun product ID this tour books against. Only Hunter Valley has one;
   * every other tour is a private tour booked by enquiry, not sold online.
   */
  bokunProductId?: string;
  /** Pickup window, e.g. "6:30-7:10am". */
  startTime?: string;
  /** Return time and/or drop-off point, e.g. "~5:52pm Circular Quay". */
  returnTime?: string;
  /** Where guests are picked up, e.g. "Selected Sydney city hotels". */
  pickupLocation?: string;
  /** What's included on the day, shown as a list. */
  inclusions?: string[];
  /** How long the day runs, e.g. "Up to 11 hours". */
  duration?: string;
  /** Days this tour operates, e.g. "Monday & Wednesday". */
  days?: string;
  /**
   * Youngest age this tour can accommodate, if any. Kept separate from
   * `restrictions`' wording so the number itself is available to code, not
   * just to a sentence a visitor reads.
   */
  minAge?: number;
  /**
   * Hard requirements a visitor needs to see before they enquire, such as
   * age limits or dietary/safety constraints, not just once they reach the
   * terms page. Shown directly under the tour picker in the builder.
   */
  restrictions?: string[];
};

/** Extras we charge for — everything the guest doesn't pay direct on the day. */
export const chargeableAddOns = (addOns: AddOn[]): AddOn[] =>
  addOns.filter((a) => !a.payOnDay);

/** Extras the guest pays a third party for, on the day. */
export const payOnDayAddOns = (addOns: AddOn[]): AddOn[] =>
  addOns.filter((a) => a.payOnDay);

/**
 * False when a pay-on-the-day extra has no set price — bike hire billed by the
 * hour, say. Displayed as "price varies" instead of a figure.
 */
export const hasFixedPrice = (a: AddOn): boolean => (a.price ?? 0) > 0;

/** False until a real price has been confirmed for a regular (non-`payOnDay`) extra. */
export const isPriceConfirmed = (a: AddOn): boolean => a.price !== undefined;

/**
 * The quoted estimate: base fare plus chargeable extras, per guest.
 *
 * The single source of the number we show and email, so pay-on-the-day extras
 * are dropped once, here, rather than at each call site. Pass the full
 * selected list — filtering is this function's job.
 */
export function tourTotal(base: number, guests: number, selected: AddOn[]): number {
  const extras = chargeableAddOns(selected).reduce(
    (sum, a) => sum + (a.price ?? 0),
    0,
  );
  return (base + extras) * guests;
}

/**
 * Fallback / seed tour data.
 * Used to seed Firestore (scripts/seed-tours.ts) and as a graceful fallback
 * when Firestore is empty or unreachable.
 *
 * Hunter Valley is the only tour sold as its own Bókun product (1269452) and
 * priced per person (see priceAdult/priceSenior/priceChild). Every other
 * itinerary is a private tour: priced from PRIVATE_TOUR_RATE and booked by
 * enquiry only.
 */
export const SEED_TOURS: Tour[] = [
  {
    id: "blue-mountains-day",
    name: "Blue Mountains Day Trip",
    max: 16,
    order: 1,
    startTime: "6:30-7:10am",
    pickupLocation: "Selected Sydney city hotels",
    returnTime: "~5:52pm Circular Quay or 6:15pm Darling Harbour",
    inclusions: [
      "Light cooked breakfast",
      "Cider tasting and hot apple pie",
      "Progressive lunch from local produce",
      "Gourmet picnic lunch at Hanging Rock",
      "Circle loop across the mountains",
    ],
    addOns: [
      // Bought at the venue's own booth / hire counter, so the guest pays
      // these direct — we only flag that they're coming.
      { id: "scenic", name: "Scenic World pass", price: 65, payOnDay: true },
      { id: "bike", name: "Bike hire at Hanging Rock", price: 0, payOnDay: true },
      {
        id: "truffle",
        name: "Truffle hunt (seasonal)",
        price: 220,
        subjectToAvailability: true,
      },
      { id: "zigzag", name: "Zig Zag Railway", price: 46.5 },
    ],
  },
  {
    id: "hunter-valley",
    name: "Hunter Valley, private",
    priceAdult: 277,
    priceSenior: 267,
    priceChild: 257,
    min: 2,
    max: 16,
    order: 2,
    bokunProductId: "1269452",
    days: "Monday & Wednesday",
    duration: "Up to 11 hours",
    returnTime: "Sydney, around 6:30pm",
    minAge: 4,
    restrictions: [
      "Ages 4+ only. Infants 0-3 cannot be accommodated.",
      "Under 18s cannot be served alcohol.",
    ],
    inclusions: [
      "Complimentary door-to-door pickup and drop-off",
      "Progressive breakfast and lunch prepared by your chef-guide",
      "Three wine tastings matched to a modern Australian menu",
      "Special dietary requirements catered for",
      "Air-conditioned transport",
      "Small group",
    ],
    addOns: [
      { id: "winery", name: "Extra winery" },
      { id: "cheese", name: "Cheese & charcuterie board", price: 0 },
      {
        id: "truffle2",
        name: "Truffle hunt (seasonal)",
        price: 220,
        subjectToAvailability: true,
      },
    ],
  },
  {
    id: "beaches-brewery",
    name: "Sydney Beaches & Brewery",
    max: 16,
    order: 3,
    startTime: "6:30-7:00am",
    pickupLocation: "Arranged with you when you book",
    returnTime: "After 5pm, Circular Quay",
    addOns: [
      { id: "paddle", name: "Brewery tasting paddle" },
      { id: "surf", name: "Surf lesson" },
      { id: "oyster", name: "Oyster cruise", price: 93, note: "Includes shucking and tasting" },
      { id: "campfire", name: "Campfire dinner" },
    ],
  },
  {
    id: "foodie",
    name: "Half-Day Sydney Foodie",
    max: 16,
    order: 4,
    inclusions: [
      "Bakery",
      "Fish market",
      "Meat market",
      "Cafe",
      "Chocolate",
      "Cheese",
      "Deli",
      "Pie",
    ],
    addOns: [
      { id: "fish", name: "Fish market tasting", price: 0, note: "Mornings only" },
      { id: "choc", name: "Chocolate & cheese flight", price: 25 },
    ],
  },
];
