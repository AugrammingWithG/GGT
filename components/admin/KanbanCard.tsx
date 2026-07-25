"use client";

import type { CSSProperties } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Mail, Phone, Trash2, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { money } from "@/lib/money";
import { fmtDate } from "./format";
import type { Enquiry } from "./types";

export default function KanbanCard({
  enquiry: e,
  onDelete,
  style,
}: {
  enquiry: Enquiry;
  onDelete: (id: string) => void;
  /** Entrance stagger from KanbanColumn — lands on the glass element itself so
   *  no wrapper transform can flatten this card's backdrop-filter. */
  style?: CSSProperties;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: e.id,
  });

  return (
    <Card
      ref={setNodeRef}
      style={{ ...style, transform: CSS.Translate.toString(transform) }}
      className={`animate-in fade-in zoom-in-95 fill-mode-both cursor-grab touch-none py-0 transition-all duration-200 active:cursor-grabbing ${isDragging ? "scale-105 opacity-70 shadow-2xl" : "hover:-translate-y-0.5 hover:shadow-lg"}`}
      {...listeners}
      {...attributes}
    >
      <CardContent className="p-4">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <p className="min-w-0 truncate text-sm font-semibold leading-tight text-white">{e.name}</p>
          <button
            onClick={(ev) => {
              ev.stopPropagation();
              onDelete(e.id);
            }}
            className="shrink-0 text-muted-foreground/60 hover:text-destructive"
            aria-label="Delete enquiry"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{e.tourName}</p>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="size-3" />
            {e.guests}
          </span>
          <span className="font-mono font-semibold text-[var(--gold)]">
            {money(e.total)}
          </span>
        </div>

        <p className="mt-2 text-[11px] text-muted-foreground">
          {e.status === "confirmed" ? "Confirmed for " : "Preferred "}
          {fmtDate(e.status === "confirmed" ? e.tourDate : e.preferredDate)}
        </p>

        <div className="mt-2 flex items-center gap-2.5 border-t border-border pt-2 text-[11px] text-muted-foreground">
          <a
            href={`mailto:${e.email}`}
            onClick={(ev) => ev.stopPropagation()}
            className="flex items-center gap-1 hover:text-foreground"
          >
            <Mail className="size-3" />
          </a>
          {e.phone && (
            <a
              href={`tel:${e.phone}`}
              onClick={(ev) => ev.stopPropagation()}
              className="flex items-center gap-1 hover:text-foreground"
            >
              <Phone className="size-3" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
