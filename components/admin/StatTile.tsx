import type { LucideIcon } from "lucide-react";

/**
 * One column inside a `.glass-outline` strip (see OverviewPage) — no card
 * shape of its own. A row of these separated by a border-l each reads as one
 * outlined division with internal lines, not N overlapping boxes.
 *
 * `min-w-0` on the flex item (and its text wrapper) matters here: a flex
 * item's default min-width is `auto`, meaning it won't shrink below its
 * content's natural width (an unbroken value like "A$6,470" can't wrap) —
 * without this, four of these in a row force the whole strip wider than its
 * container instead of sharing the space, and the overflow spills out past
 * the right edge rather than being visible as a sizing bug.
 */
export default function StatTile({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  /** A CSS color (hex or var(--x)) the icon is tinted with. Defaults to gold. */
  color?: string;
}) {
  const tint = color ?? "var(--gold)";
  return (
    <div className="flex min-w-0 flex-1 items-center justify-between gap-3 px-5 py-4">
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-1.5 truncate text-2xl font-semibold text-white">{value}</p>
      </div>
      <Icon className="size-5 shrink-0" style={{ color: tint }} />
    </div>
  );
}
