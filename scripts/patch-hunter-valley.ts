/**
 * Patches only the new descriptive fields onto the live `hunter-valley`
 * Firestore doc: days, duration, returnTime, minAge, restrictions,
 * inclusions. Deliberately narrower than scripts/seed-tours.ts (which
 * upserts every field on every tour): pricing and addOns in lib/tours.ts
 * are stale placeholders relative to the live doc (confirmed against
 * tours-backup-2026-07-24T09-15-49-512Z.json), so a full reseed would
 * silently overwrite real prices. This script only ever touches the six
 * fields named above, via a merge write.
 *
 * Usage:
 *   1. Ensure FIREBASE_SERVICE_ACCOUNT is set (e.g. in .env.local).
 *   2. npx tsx scripts/patch-hunter-valley.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { SEED_TOURS } from "../lib/tours";

function loadEnvLocal() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) return;
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    /* no .env.local; rely on the ambient environment */
  }
}

async function main() {
  loadEnvLocal();

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT is not set.");
  }
  const serviceAccount = JSON.parse(raw);
  if (typeof serviceAccount.private_key === "string") {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
  }

  if (!getApps().length) {
    initializeApp({ credential: cert(serviceAccount) });
  }
  const db = getFirestore();

  const hunterValley = SEED_TOURS.find((t) => t.id === "hunter-valley");
  if (!hunterValley) throw new Error("hunter-valley missing from SEED_TOURS.");

  const { days, duration, returnTime, minAge, restrictions, inclusions } = hunterValley;
  const patch = { days, duration, returnTime, minAge, restrictions, inclusions };

  const ref = db.collection("tours").doc("hunter-valley");
  const before = (await ref.get()).data();
  console.log("Before:", JSON.stringify(before, null, 2));
  console.log("Patching with:", JSON.stringify(patch, null, 2));

  await ref.set(patch, { merge: true });

  const after = (await ref.get()).data();
  console.log("After:", JSON.stringify(after, null, 2));
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
