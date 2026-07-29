import "server-only";
import { adminDb } from "./firebase.admin";
import {
  DEFAULT_MAX_GUESTS,
  PRIVATE_TOUR_RATE,
  SEED_TOURS,
  type PrivateTourRate,
  type Tour,
} from "./tours";

/**
 * Fetches tours from the Firestore `tours` collection, ordered by `order`.
 * Falls back to SEED_TOURS when the collection is empty or Firestore is
 * unreachable / unconfigured, so the homepage always renders.
 */
export async function getTours(): Promise<Tour[]> {
  try {
    const snap = await adminDb().collection("tours").orderBy("order").get();
    if (snap.empty) return SEED_TOURS;
    return snap.docs.map((d) => {
      const data = d.data();
      // Spread rather than list fields by hand — the field list has gone
      // stale before (this is the second pricing-shape change) and a
      // hand-copied list silently drops whatever's newest.
      return {
        ...data,
        id: d.id,
        max: data.max ?? DEFAULT_MAX_GUESTS,
        addOns: data.addOns ?? [],
      } as Tour;
    });
  } catch (err) {
    console.warn("getTours: falling back to seed data –", err);
    return SEED_TOURS;
  }
}

/**
 * Fetches the private-tour rate from the Firestore `settings/pricing` doc.
 * Falls back to PRIVATE_TOUR_RATE when the doc is missing or Firestore is
 * unreachable, so the booking widget always has a rate to quote from.
 */
export async function getPrivateTourRate(): Promise<PrivateTourRate> {
  try {
    const snap = await adminDb().collection("settings").doc("pricing").get();
    if (!snap.exists) return PRIVATE_TOUR_RATE;
    return { ...PRIVATE_TOUR_RATE, ...snap.data() };
  } catch (err) {
    console.warn("getPrivateTourRate: falling back to seed rate –", err);
    return PRIVATE_TOUR_RATE;
  }
}
