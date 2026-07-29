import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase.admin";

export const runtime = "nodejs";

const VID_COOKIE = "ggt_vid";
const VID_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

const todayKey = (): string => new Date().toISOString().slice(0, 10);

/** POST — public: record one pageview. Fire-and-forget from VisitorBeacon. */
export async function POST(req: NextRequest) {
  let vid = req.cookies.get(VID_COOKIE)?.value;
  const isNewVisitor = !vid;
  if (!vid) vid = randomUUID();

  try {
    await adminDb()
      .collection("analytics_daily")
      .doc(todayKey())
      .set(
        {
          date: todayKey(),
          pageviews: FieldValue.increment(1),
          visitorIds: FieldValue.arrayUnion(vid),
        },
        { merge: true },
      );
  } catch (err) {
    console.error("Failed to record pageview:", err);
  }

  const res = NextResponse.json({ ok: true });
  if (isNewVisitor) {
    res.cookies.set(VID_COOKIE, vid, {
      maxAge: VID_MAX_AGE,
      path: "/",
      sameSite: "lax",
    });
  }
  return res;
}
