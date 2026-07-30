"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import KanbanCard from "./KanbanCard";
import type { Enquiry, EnquiryStatus } from "./types";

const ACCENT: Record<EnquiryStatus, string> = {
  new: "bg-[var(--status-new)]",
  confirmed: "bg-[var(--status-confirmed)]",
  handled: "bg-[var(--status-handled)]",
};

const COLOR: Record<EnquiryStatus, string> = {
  new: "var(--status-new)",
  confirmed: "var(--status-confirmed)",
  handled: "var(--status-handled)",
};

export default function KanbanColumn({
  status,
  title,
  enquiries,
  onDelete,
}: {
  status: EnquiryStatus;
  title: string;
  enquiries: Enquiry[];
  onDelete: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const color = COLOR[status];

  return (
    <div className="flex w-80 shrink-0 flex-col md:w-96">
      <div className="mb-3 flex items-center gap-2 px-1.5">
        <span className={cn("size-2 rounded-full", ACCENT[status])} />
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {enquiries.length}
        </span>
      </div>
      {/*
        `transform` is set only while a card is over this column. It used to be
        `scale(1)` on every render — an identity transform still counts, and any
        non-`none` transform makes the element a *backdrop root* for everything
        inside it, so the glass cards' backdrop-filter had nothing behind it to
        blur and the whole column rendered flat (this is why Enquiries lost the
        frost Overview and Pricing have).
      */}
      <div
        ref={setNodeRef}
        className="relative flex min-h-[60vh] flex-col rounded-xl transition-transform duration-200"
        style={{ transform: isOver ? "scale(1.01)" : undefined }}
      >
        {/*
          The tray, as its own layer *behind* the cards — a paper-tinted
          panel, not a separate card shape, so a column full of cards reads
          as one tray rather than a card nested inside a card. Fill is a
          faint wash of the column's status colour into the site's paper
          tint (matches how .tint-wine/.tint-green work on the public site).
        */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-xl transition-all duration-200"
          style={{
            background: `color-mix(in oklab, ${color} ${isOver ? 10 : 5}%, var(--paper))`,
            border: `1.5px solid color-mix(in oklab, ${color} ${isOver ? 55 : 25}%, var(--line))`,
            boxShadow: isOver
              ? `0 0 0 3px color-mix(in oklab, ${color} 18%, transparent), var(--shadow-sm)`
              : "var(--shadow-sm)",
          }}
        />
        <div className="relative flex flex-1 flex-col gap-3 p-3.5">
          {enquiries.length === 0 && (
            <p className="animate-in fade-in px-1.5 py-4 text-center text-xs text-muted-foreground">
              No enquiries here.
            </p>
          )}
          {/* Stagger goes on the card itself, not a wrapper div: an entrance
              animation held by `fill-mode-both` keeps a transform on whatever
              element carries it, and on a wrapper that transform would break
              the card's frost exactly like the column's used to. */}
          {enquiries.map((e, i) => (
            <KanbanCard
              key={e.id}
              enquiry={e}
              onDelete={onDelete}
              style={{ animationDelay: `${i * 40}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
