import { NextResponse } from "next/server";
import { adminDb, verifyAdmin } from "@/lib/firebase.admin";

export const runtime = "nodejs";

const DAYS = 30;

const dateKey = (d: Date): string => d.toISOString().slice(0, 10);

type DayStat = { date: string; pageviews: number; visitors: number };

const sumStats = (days: DayStat[]) =>
  days.reduce(
    (acc, d) => ({
      pageviews: acc.pageviews + d.pageviews,
      visitors: acc.visitors + d.visitors,
    }),
    { pageviews: 0, visitors: 0 },
  );

/** GET — admin only: last 30 days of pageview/visitor counts for the Overview chart. */
export async function GET(req: Request) {
  const admin = await verifyAdmin(req.headers.get("authorization"));
  if (!admin) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  const today = new Date();
  const keys = Array.from({ length: DAYS }, (_, i) => {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - (DAYS - 1 - i));
    return dateKey(d);
  });

  const snaps = await Promise.all(
    keys.map((k) => adminDb().collection("analytics_daily").doc(k).get()),
  );

  const series: DayStat[] = snaps.map((snap, i) => {
    const v = snap.data();
    return {
      date: keys[i],
      pageviews: typeof v?.pageviews === "number" ? v.pageviews : 0,
      visitors: Array.isArray(v?.visitorIds) ? v.visitorIds.length : 0,
    };
  });

  return NextResponse.json({
    series,
    today: series[series.length - 1] ?? { date: keys[keys.length - 1], pageviews: 0, visitors: 0 },
    last7: sumStats(series.slice(-7)),
    last30: sumStats(series),
  });
}
