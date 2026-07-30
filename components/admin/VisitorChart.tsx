"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type DayStat = { date: string; pageviews: number; visitors: number };

// Live CSS custom properties, not resolved hex — same trick KanbanColumn and
// TourCard already use inline (style={{color:"var(--gold)"}}) — so the chart
// re-colors itself for free when ThemeToggle flips data-theme.
const LINE = "var(--gold-muted)";
const GRID = "var(--line)";
const AXIS_TEXT = "var(--ink-soft)";

function shortDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${Number(d)}/${Number(m)}`;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: DayStat }[];
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      className="glass-pane rounded-lg px-3 py-2 text-xs text-foreground"
      style={{ background: "var(--popover)" }}
    >
      <p className="font-medium">{d.date}</p>
      <p className="mt-1 text-muted-foreground">
        {d.visitors} visitor{d.visitors === 1 ? "" : "s"} · {d.pageviews} pageview
        {d.pageviews === 1 ? "" : "s"}
      </p>
    </div>
  );
}

/** 30-day unique-visitor trend. Single series (sequential/brand hue, no legend needed) — pageviews are surfaced in the tooltip and the stat tiles beside it rather than a second plotted line, since the two measures don't share a scale. */
export default function VisitorChart({
  series,
  className = "h-80",
}: {
  series: DayStat[];
  className?: string;
}) {
  const last = series[series.length - 1];

  return (
    <div className={`${className} w-full`}>
      <div className="mb-1 flex items-baseline gap-2 px-1">
        <span className="text-xs text-muted-foreground">Today</span>
        <span className="text-sm font-semibold" style={{ color: LINE }}>
          {last?.visitors ?? 0} visitor{last?.visitors === 1 ? "" : "s"}
        </span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="visitorFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={LINE} stopOpacity={0.35} />
              <stop offset="100%" stopColor={LINE} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={GRID} strokeWidth={1} />
          <XAxis
            dataKey="date"
            tickFormatter={shortDate}
            tick={{ fontSize: 11, fill: AXIS_TEXT }}
            axisLine={{ stroke: GRID }}
            tickLine={false}
            interval={6}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: AXIS_TEXT }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: GRID, strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="visitors"
            stroke={LINE}
            strokeWidth={2}
            fill="url(#visitorFill)"
            dot={false}
            activeDot={{ r: 5, fill: LINE, stroke: "var(--card)", strokeWidth: 2 }}
            isAnimationActive
            animationDuration={900}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
