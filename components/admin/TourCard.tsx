"use client";

import { Map, Users, Ticket, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Tour } from "@/lib/tours";

export default function TourCard({
  tour,
  onOpen,
}: {
  tour: Tour;
  onOpen: () => void;
}) {
  return (
    <Card
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
      className="flex h-full w-full min-w-0 cursor-pointer flex-col gap-0 py-0 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
    >
      <CardContent className="flex min-w-0 flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div
            className="flex size-9 items-center justify-center rounded-full"
            style={{
              backgroundColor: "color-mix(in oklab, var(--gold) 20%, transparent)",
            }}
          >
            <Map className="size-5" style={{ color: "var(--gold)" }} />
          </div>
          {tour.fareharborItemId && (
            <Badge variant="secondary" className="gap-1">
              <Ticket className="size-3" />
              FH
            </Badge>
          )}
        </div>

        <p className="mt-2.5 text-base font-semibold leading-tight text-white">
          {tour.name}
        </p>
        <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{tour.id}</p>

        <div className="mt-auto flex items-center gap-3 pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="size-3" />
            {tour.min ? `${tour.min}–${tour.max}` : `up to ${tour.max}`}
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="size-3" />
            {tour.addOns.length} add-on{tour.addOns.length === 1 ? "" : "s"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
