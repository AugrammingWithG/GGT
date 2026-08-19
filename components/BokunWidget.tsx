import Script from "next/script";
import {
  BOKUN_LOADER_SRC,
  bokunExperienceCalendarSrc,
} from "@/lib/booking";

/**
 * A Bókun experience-calendar widget — availability, guests and checkout, all
 * hosted by Bókun in an iframe. Bókun sends its own booking confirmation, so
 * nothing here emails the guest.
 *
 * The loader script is rendered alongside the widget div, so it loads on the
 * one page that has a widget rather than site-wide. It must stay a single
 * instance: the loader no-ops if `window.__BokunWidgetsLoader` is already set,
 * and the widgets app it injects `alert()`s the visitor if it is initialised
 * twice — so never render two of these, or move the script to the root layout
 * as well.
 *
 * Soft navigation is handled by Bókun, not by us: once loaded, the widgets app
 * keeps a MutationObserver on document.body and initialises any `.bokunWidget`
 * element added afterwards. That covers a client-side nav back into this page,
 * where next/script won't re-run the already-loaded loader. Don't try to force
 * the loader to re-execute to "fix" soft nav — that triggers the double-init
 * alert.
 */
export default function BokunWidget({ productId }: { productId: string }) {
  return (
    <>
      <div className="bokunWidget" data-src={bokunExperienceCalendarSrc(productId)} />
      <noscript>Please enable javascript in your browser to book</noscript>
      <Script src={BOKUN_LOADER_SRC} strategy="afterInteractive" />
    </>
  );
}
