/**
 * ⚠️  THIS SCRIPT EDITS LIVE DATA. IT IS NOT RUN AUTOMATICALLY, AND NOTHING
 * ⚠️  IN THE BUILD OR THE APP CALLS IT. Run it by hand, once, against the
 * ⚠️  Firestore project you actually mean to change — check which project
 * ⚠️  FIREBASE_SERVICE_ACCOUNT points at before you do.
 *
 * Removes the retired `fareharborItemId` field from every document in the
 * `tours` collection, left behind by the move from FareHarbor to Bókun. The
 * code no longer reads it, so this is tidy-up rather than a fix: an orphan
 * field is invisible to the site but still shows up in exports and backups.
 *
 * Why a separate script and not scripts/seed-tours.ts: a merge write leaves
 * fields it isn't given untouched, so simply dropping the field from
 * SEED_TOURS never deletes it from a document that already has it. Only an
 * explicit FieldValue.delete() does.
 *
 * It does NOT write `bokunProductId` — scripts/seed-tours.ts already carries
 * that from SEED_TOURS, and Hunter Valley's ID may have been set in the admin
 * dashboard by the time you run this. This only ever deletes.
 *
 * Usage:
 *   1. Ensure FIREBASE_SERVICE_ACCOUNT is set (e.g. in .env.local) and points
 *      at the project you intend to modify.
 *   2. npx tsx scripts/remove-fareharbor-fields.ts          # dry run, prints only
 *   3. npx tsx scripts/remove-fareharbor-fields.ts --apply  # actually deletes
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

/** Fields written by the old FareHarbor integration, now unread by any code. */
const DEAD_FIELDS = ["fareharborItemId"] as const;

// Minimal .env.local loader (so the script works without extra deps).
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
  const apply = process.argv.includes("--apply");
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

  // Named out loud, every run: this is the only guard against pointing a
  // destructive write at the wrong project.
  console.log(`Project: ${serviceAccount.project_id}`);
  console.log(apply ? "Mode:    APPLY (will delete)" : "Mode:    DRY RUN (no writes)");
  console.log("");

  const snap = await db.collection("tours").get();
  const batch = db.batch();
  let affected = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const present = DEAD_FIELDS.filter((f) => data[f] !== undefined);
    if (present.length === 0) continue;

    affected++;
    console.log(
      `${doc.id}: removing ${present.map((f) => `${f}=${JSON.stringify(data[f])}`).join(", ")}`,
    );
    batch.update(
      doc.ref,
      Object.fromEntries(present.map((f) => [f, FieldValue.delete()])),
    );
  }

  if (affected === 0) {
    console.log("Nothing to do — no document carries a FareHarbor field.");
    return;
  }

  if (!apply) {
    console.log(`\n${affected} document(s) would change. Re-run with --apply to delete.`);
    return;
  }

  await batch.commit();
  console.log(`\nDone. Updated ${affected} document(s).`);
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
