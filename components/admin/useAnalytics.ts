"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "./admin-auth";

type DayStat = { date: string; pageviews: number; visitors: number };
type Totals = { pageviews: number; visitors: number };
type Summary = { series: DayStat[]; today: DayStat; last7: Totals; last30: Totals };

export function useAnalytics() {
  const { authHeader } = useAdminAuth();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const headers = await authHeader();
      const res = await fetch("/api/analytics/summary", { headers });
      if (res.ok) setSummary(await res.json());
      setLoading(false);
    })();
  }, [authHeader]);

  return { summary, loading };
}
