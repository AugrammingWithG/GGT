import { NextResponse } from "next/server";
import { z } from "zod";
import { adminDb, verifyAdmin } from "@/lib/firebase.admin";
import { PRIVATE_TOUR_RATE } from "@/lib/tours";

export const runtime = "nodejs";

const rateSchema = z.object({
  base: z.number().nonnegative(),
  baseCoversMin: z.number().int().min(1),
  baseCoversMax: z.number().int().min(1),
  extraGuestPrice: z.number().nonnegative(),
  maxGuests: z.number().int().min(1),
  includes: z.array(z.string()),
});

/** GET — admin only: current private-tour rate (Firestore doc, or the seed default). */
export async function GET(req: Request) {
  const admin = await verifyAdmin(req.headers.get("authorization"));
  if (!admin) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  const snap = await adminDb().collection("settings").doc("pricing").get();
  const rate = snap.exists ? { ...PRIVATE_TOUR_RATE, ...snap.data() } : PRIVATE_TOUR_RATE;
  return NextResponse.json({ rate });
}

/** PUT — admin only: update the private-tour rate. */
export async function PUT(req: Request) {
  const admin = await verifyAdmin(req.headers.get("authorization"));
  if (!admin) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  const parsed = rateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid rate." },
      { status: 422 },
    );
  }

  await adminDb().collection("settings").doc("pricing").set(parsed.data);
  return NextResponse.json({ ok: true });
}
