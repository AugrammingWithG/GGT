import { mediaBg } from "@/lib/media";

const ADMIN_BG = mediaBg(
  "linear-gradient(150deg,#858d47,#35381d)",
  "/images/tours/hunter.webp",
  "32% center",
);

/**
 * Fixed nature-photo backdrop behind the whole admin dashboard — the same
 * photo the public site's NatureBackdrop echoes (HunterHero's HUNTER_BG), so
 * the admin feels like part of the same place rather than a bolted-on tool.
 * Every panel above it is frosted glass (see .glass-pane in admin.css); this
 * is what they float over.
 */
export default function AdminBackdrop() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10" style={{ background: ADMIN_BG }}>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,30,22,.26),rgba(9,14,10,.48))]" />
    </div>
  );
}
