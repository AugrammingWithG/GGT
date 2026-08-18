/**
 * One-off migration off FareHarbor and onto Bókun.
 *
 * Two jobs, over every doc in `tours`:
 *   1. Genuinely remove FareHarbor fields with FieldValue.delete(), so they're
 *      gone rather than left holding stale item IDs. A merge write can't do
 *      this — omitting a field keeps whatever was already there.
 *   2. Set `bokunProductId` on `hunter-valley`, the one tour sold online.
 *
 * As well as the known field names, this deletes *any* field whose name
 * mentions "fareharbor" in any casing, so an older write that used a different
 * spelling doesn't survive the migration unnoticed.
 *
 * Safe to run more than once: a doc with nothing to change is skipped.
 *
 * Usage:
 *   1. Ensure FIREBASE_SERVICE_ACCOUNT is set (e.g. in .env.local).
 *   2. npx tsx scripts/migrate-fareharbor-to-bokun.ts --dry-run   # preview
 *      npx tsx scripts/migrate-fareharbor-to-bokun.ts             # apply
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { BOKUN_HUNTER_VALLEY_PRODUCT_ID } from "../lib/bokun";

/** Field names we know FareHarbor used, deleted whether or not they're set. */
const FAREHARBOR_FIELDS = ["fareharborItemId", "fareharborFlow", "fareharborShortname"];

/** The tour that books online, and the Bókun product it books against. */
const ONLINE_TOUR_ID = "hunter-valley";

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
  const dryRun = process.argv.includes("--dry-run");
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

  const snap = await db.collection("tours").get();
  console.log(
    `${dryRun ? "[dry run] " : ""}Scanning ${snap.size} tour doc(s)…\n`,
  );

  let changed = 0;

  for (const doc of snap.docs) {
    const data = doc.data();

    // Known names plus anything else that mentions FareHarbor, so a stray
    // field from an older write can't slip through.
    const stale = new Set([
      ...FAREHARBOR_FIELDS.filter((f) => f in data),
      ...Object.keys(data).filter((k) => k.toLowerCase().includes("fareharbor")),
    ]);

    const patch: Record<string, unknown> = {};
    for (const field of stale) patch[field] = FieldValue.delete();

    if (doc.id === ONLINE_TOUR_ID && data.bokunProductId !== BOKUN_HUNTER_VALLEY_PRODUCT_ID) {
      patch.bokunProductId = BOKUN_HUNTER_VALLEY_PRODUCT_ID;
    }

    if (Object.keys(patch).length === 0) {
      console.log(`  ${doc.id}: nothing to change`);
      continue;
    }

    changed += 1;
    const removed = [...stale];
    console.log(
      `  ${doc.id}: ${removed.length ? `delete ${removed.join(", ")}` : "no deletions"}` +
        (patch.bokunProductId ? ` · set bokunProductId=${patch.bokunProductId}` : ""),
    );

    if (!dryRun) await doc.ref.set(patch, { merge: true });
  }

  console.log(
    `\n${dryRun ? "[dry run] Would update" : "Updated"} ${changed} doc(s).`,
  );
  if (dryRun) console.log("Re-run without --dry-run to apply.");
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
