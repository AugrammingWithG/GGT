import { bokunExperienceCalendarSrc } from "@/lib/booking";

/**
 * A Bókun experience-calendar widget — availability, guests and checkout, all
 * hosted by Bókun in an iframe. Bókun sends its own booking confirmation, so
 * nothing here emails the guest.
 *
 * This renders only the target div. The loader script that turns it into a
 * booking box is loaded once for the whole site in app/layout.tsx — never add
 * a second copy here or on a page. The loader no-ops if
 * `window.__BokunWidgetsLoader` is already set, and the widgets app it injects
 * `alert()`s the visitor if it is initialised twice.
 *
 * Ordering and soft navigation are handled by Bókun, not by us: once loaded,
 * the widgets app keeps a MutationObserver on document.body and initialises
 * any `.bokunWidget` element added afterwards. That covers both this div
 * mounting after the site-wide loader has run and a client-side nav back into
 * this page. Don't try to force the loader to re-execute to "fix" soft nav —
 * that triggers the double-init alert.
 */
export default function BokunWidget({ productId }: { productId: string }) {
  return (
    <>
      <div className="bokunWidget" data-src={bokunExperienceCalendarSrc(productId)} />
      <noscript>Please enable javascript in your browser to book</noscript>
    </>
  );
}
