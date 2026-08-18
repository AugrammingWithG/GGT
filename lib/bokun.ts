/**
 * Bókun booking widget integration.
 *
 * Replaces the old FareHarbor Lightframe embed. The difference that matters:
 * FareHarbor booked through a *link* (its API script intercepted clicks and
 * opened a modal anywhere on the site), whereas Bókun renders an inline
 * booking calendar into a `.bokunWidget` div on the page it lives on.
 *
 * So there is exactly one booking surface now — the widget on
 * /hunter-valley-tour — and every other "Book now" on the site is an ordinary
 * link pointing at it. Private tours don't book online at all; they go to the
 * enquiry form.
 *
 * The channel UUID and product ID are not secrets: both are visible in the
 * widget's own public URL. They're env-overridable only so a staging channel
 * can be swapped in without a code change.
 */

/** Booking channel UUID from the Bókun dashboard. */
export const BOKUN_CHANNEL_UUID =
  process.env.NEXT_PUBLIC_BOKUN_CHANNEL_UUID ??
  "9e58f814-1ad8-4004-a5ce-f59e2c2211aa";

/** Hunter Valley Food & Wine Tour — the only product sold online. */
export const BOKUN_HUNTER_VALLEY_PRODUCT_ID =
  process.env.NEXT_PUBLIC_BOKUN_HUNTER_VALLEY_PRODUCT_ID ?? "1269452";

/**
 * The one page carrying the booking widget. Fixed CTAs elsewhere (header,
 * footer, hero, cards) link here rather than trying to open a modal.
 */
export const BOOKING_HREF = "/hunter-valley-tour#book";

/** Where private / bespoke tours send people instead — they aren't sold online. */
export const ENQUIRY_HREF = "/contact";

/** Loader script. Scans the DOM for `.bokunWidget` divs and fills them in. */
export const bokunLoaderSrc = (): string =>
  `https://widgets.bokun.io/assets/javascripts/apps/build/BokunWidgetsLoader.js?bookingChannelUUID=${BOKUN_CHANNEL_UUID}`;

/** `data-src` for a single product's experience-calendar widget. */
export const bokunWidgetSrc = (productId: string): string =>
  `https://widgets.bokun.io/online-sales/${BOKUN_CHANNEL_UUID}/experience-calendar/${productId}`;
