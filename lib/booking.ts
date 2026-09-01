/**
 * Bókun booking integration.
 *
 * Hunter Valley is the only tour sold online: it books through a Bókun
 * experience-calendar widget embedded on /hunter-valley-tour (see
 * components/BokunWidget.tsx). Every other tour is a private tour, quoted by
 * hand, so its CTA goes to the enquiry form instead of a checkout.
 *
 * The channel UUID and product ID are public — they appear in the widget's own
 * markup and in the URLs the browser requests — so they live here as constants
 * rather than as env vars.
 */

/** Booking channel this site sells through. */
export const BOKUN_BOOKING_CHANNEL_UUID = "9e58f814-1ad8-4004-a5ce-f59e2c2211aa";

/** Bókun product ID for the Hunter Valley Food & Wine Tour. */
export const BOKUN_HUNTER_VALLEY_PRODUCT_ID = "1269452";

/** The widgets loader. Loaded once for the whole site, from app/layout.tsx. */
export const BOKUN_LOADER_SRC =
  `https://widgets.bokun.io/assets/javascripts/apps/build/BokunWidgetsLoader.js` +
  `?bookingChannelUUID=${BOKUN_BOOKING_CHANNEL_UUID}`;

/** `data-src` for an experience-calendar widget — the booking box itself. */
export function bokunExperienceCalendarSrc(productId: string): string {
  return `https://widgets.bokun.io/online-sales/${BOKUN_BOOKING_CHANNEL_UUID}/experience-calendar/${productId}`;
}

/**
 * Where the fixed "Book now" CTAs (header, home hero, tour cards) point: the
 * Hunter Valley page, scrolled to its booking widget. Booking happens in the
 * widget, so these are links to it rather than checkout links of their own.
 */
export const HUNTER_VALLEY_BOOKING_HREF = "/hunter-valley-tour#book";

/** Where every private-tour CTA points — private tours are enquiry-first. */
export const ENQUIRY_HREF = "/contact";
