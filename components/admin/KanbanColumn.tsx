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
        <span className={cn("size-2 rounded-full shadow-[0_0_8px_currentColor]", ACCENT[status])} />
        <h2 className="text-sm font-semibold text-white">{title}</h2>
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
          The frosted tray, as its own layer *behind* the cards rather than a
          backdrop-filter on the column itself — for the same backdrop-root
          reason. Blurring the column would frost the tray but leave the cards
          sampling the column instead of the photo. As a sibling they each frost
          the backdrop independently: tray over the photo, cards over the tray.
          Fill is the shared --glass white tinted with the column's status
          colour, so it reads as glass first and status second (the old 6% pure
          colour wash was a tint with no glass in it).
        */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-xl transition-all duration-200"
          style={{
            background: `color-mix(in oklab, ${color} ${isOver ? 14 : 8}%, var(--glass))`,
            border: `2px solid color-mix(in oklab, ${color} ${isOver ? 75 : 45}%, transparent)`,
            WebkitBackdropFilter: "var(--glass-blur)",
            backdropFilter: "var(--glass-blur)",
            boxShadow: isOver
              ? `0 0 0 3px color-mix(in oklab, ${color} 25%, transparent), 0 6px 16px -10px rgba(0, 0, 0, 0.55)`
              : "0 6px 16px -10px rgba(0, 0, 0, 0.55)",
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
