/**
 * Dumps the current Firestore `tours` collection to stdout and to a local
 * JSON backup file, so it can be inspected/restored before running the seed.
 *
 * Usage:
 *   npx tsx scripts/backup-tours.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

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

  const snapshot = await db.collection("tours").get();
  const docs: Record<string, unknown> = {};
  for (const doc of snapshot.docs) {
    docs[doc.id] = doc.data();
  }

  const json = JSON.stringify(docs, null, 2);
  console.log(json);

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outPath = resolve(process.cwd(), `tours-backup-${timestamp}.json`);
  writeFileSync(outPath, json, "utf8");
  console.error(`\nSaved backup of ${snapshot.size} tours to ${outPath}`);
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
