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
      <div
        ref={setNodeRef}
        className="flex min-h-[60vh] flex-col gap-3 rounded-xl p-3.5 transition-all duration-200"
        style={{
          border: `2px solid color-mix(in oklab, ${color} ${isOver ? 75 : 45}%, transparent)`,
          backgroundColor: `color-mix(in oklab, ${color} ${isOver ? 12 : 6}%, transparent)`,
          boxShadow: isOver ? `0 0 0 3px color-mix(in oklab, ${color} 25%, transparent)` : "none",
          transform: isOver ? "scale(1.01)" : "scale(1)",
        }}
      >
        {enquiries.length === 0 && (
          <p className="animate-in fade-in px-1.5 py-4 text-center text-xs text-muted-foreground">
            No enquiries here.
          </p>
        )}
        {enquiries.map((e, i) => (
          <div
            key={e.id}
            className="animate-in fade-in slide-in-from-bottom-1 fill-mode-both duration-300"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <KanbanCard enquiry={e} onDelete={onDelete} />
          </div>
        ))}
      </div>
    </div>
  );
}
