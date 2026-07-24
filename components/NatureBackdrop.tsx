import { HUNTER_BG } from "./HunterHero";

/**
 * The page-wide nature backdrop, fixed behind the frosted-glass sections
 * below the hero (see .nature-bg / .nature-page in globals.css). A static
 * echo of the Hunter Valley hero photo rather than a live mirror: there's
 * no longer an autoplaying "active slide" for it to track now that the
 * destination gallery is a plain scroll row instead of a carousel.
 */
export default function NatureBackdrop() {
  return (
    <div className="nature-bg" aria-hidden>
      <div className="nature-bg-layer is-top" style={{ background: HUNTER_BG }} />
    </div>
  );
}
