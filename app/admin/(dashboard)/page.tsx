"use client";

import Link from "next/link";
import { Users, Eye, Inbox, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatTile from "@/components/admin/StatTile";
import VisitorChart from "@/components/admin/VisitorChart";
import { useAnalytics } from "@/components/admin/useAnalytics";
import { useEnquiries } from "@/components/admin/useEnquiries";
import { fmtDate } from "@/components/admin/format";
import { money } from "@/lib/money";
import type { EnquiryStatus } from "@/components/admin/types";

const STAGES: { status: EnquiryStatus; label: string; color: string }[] = [
  { status: "new", label: "New", color: "var(--status-new)" },
  { status: "confirmed", label: "Confirmed", color: "var(--status-confirmed)" },
  { status: "handled", label: "Handled", color: "var(--status-handled)" },
];

export default function OverviewPage() {
  const { summary, loading: loadingAnalytics } = useAnalytics();
  const { enquiries, loading: loadingEnquiries } = useEnquiries();

  const newCount = enquiries.filter((e) => e.status === "new").length;
  // NaN-safe: a legacy enquiry doc missing `total` must not poison the sum.
  const pipelineRevenue = enquiries
    .filter((e) => e.status !== "handled")
    .reduce((sum, e) => sum + (e.total ?? 0), 0);

  const recent = enquiries.slice(0, 6);

  return (
    <div className="flex animate-in flex-col gap-6 fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-3xl font-semibold text-white">Overview</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          How the site and the enquiry pipeline are doing.
        </p>
      </div>

      {/* One outlined strip, divided by hairlines — not four separate card
          shapes competing for the same small gaps (see glass-outline in
          admin.css). */}
      <div className="glass-outline flex flex-col divide-y divide-white/10 overflow-hidden rounded-2xl sm:flex-row sm:divide-x sm:divide-y-0">
        <StatTile
          label="Visitors today"
          value={loadingAnalytics ? "…" : String(summary?.today.visitors ?? 0)}
          icon={Users}
          color="var(--status-new)"
        />
        <StatTile
          label="Visitors (7d)"
          value={loadingAnalytics ? "…" : String(summary?.last7.visitors ?? 0)}
          icon={Eye}
          color="var(--status-new)"
        />
        <StatTile
          label="New enquiries"
          value={loadingEnquiries ? "…" : String(newCount)}
          icon={Inbox}
          color="var(--status-confirmed)"
        />
        <StatTile
          label="Pipeline revenue"
          value={loadingEnquiries ? "…" : money(pipelineRevenue)}
          icon={DollarSign}
          color="var(--status-handled)"
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Pipeline by stage</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col divide-y divide-white/10 overflow-hidden p-0 sm:flex-row sm:divide-x sm:divide-y-0">
          {STAGES.map(({ status, label, color }) => {
            const count = enquiries.filter((e) => e.status === status).length;
            const pct = enquiries.length ? Math.round((count / enquiries.length) * 100) : 0;
            return (
              <div key={status} className="min-w-0 flex-1 px-5 py-4">
                <div className="flex min-w-0 items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-white">
                    <span
                      className="size-2 shrink-0 rounded-full shadow-[0_0_8px_currentColor]"
                      style={{ backgroundColor: color, color }}
                    />
                    <span className="truncate">{label}</span>
                  </span>
                  <span className="shrink-0 font-mono text-lg font-semibold" style={{ color }}>
                    {loadingEnquiries ? "…" : count}
                  </span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Visitors, last 30 days</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingAnalytics || !summary ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : (
              <VisitorChart series={summary.series} className="h-80" />
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Recent enquiries</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-1">
            {loadingEnquiries ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">No enquiries yet.</p>
            ) : (
              recent.map((e, i) => (
                <div
                  key={e.id}
                  className={`flex min-w-0 items-start justify-between gap-2 py-3 ${i > 0 ? "border-t border-white/10" : ""}`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium leading-tight text-white">
                      {e.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {e.tourName} · {fmtDate(e.preferredDate)}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {e.status}
                  </Badge>
                </div>
              ))
            )}
            <Link
              href="/admin/enquiries"
              className="mt-auto pt-4 text-xs font-medium text-[var(--gold)] transition-colors hover:text-white hover:underline"
            >
              View all enquiries →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
