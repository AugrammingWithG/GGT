/** Creates or updates a Firebase Authentication user for the admin dashboard.
 * Usage: npm run admin:create -- admin@example.com "a-strong-password"
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // Fall back to variables supplied by the shell or deployment host.
  }
}

async function main() {
  loadEnvLocal();
  const email = process.argv[2]?.trim().toLowerCase();
  const password = process.argv[3];
  if (!email || !password) {
    throw new Error(
      'Usage: npm run admin:create -- admin@example.com "a-strong-password"',
    );
  }
  if (password.length < 6) {
    throw new Error("Firebase passwords must contain at least 6 characters.");
  }

  const allowedEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  if (!allowedEmails.includes(email)) {
    throw new Error(
      `${email} is not in ADMIN_EMAILS. Add it to .env.local and the deployment environment first.`,
    );
  }

  const rawCredentials = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!rawCredentials) throw new Error("FIREBASE_SERVICE_ACCOUNT is not set.");
  const serviceAccount = JSON.parse(rawCredentials);
  if (typeof serviceAccount.private_key === "string") {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
  }
  if (!getApps().length) {
    initializeApp({ credential: cert(serviceAccount) });
  }

  const auth = getAuth();
  try {
    const existing = await auth.getUserByEmail(email);
    await auth.updateUser(existing.uid, { password, disabled: false });
    console.log(`Updated admin login for ${email}.`);
  } catch (error: unknown) {
    if (
      typeof error === "object" && error !== null && "code" in error &&
      error.code === "auth/user-not-found"
    ) {
      await auth.createUser({ email, password, emailVerified: true });
      console.log(`Created admin login for ${email}.`);
      return;
    }
    throw error;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
