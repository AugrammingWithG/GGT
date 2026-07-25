"use client";

import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import KanbanColumn from "./KanbanColumn";
import { useEnquiries } from "./useEnquiries";
import type { Enquiry, EnquiryStatus } from "./types";

const COLUMNS: { status: EnquiryStatus; title: string }[] = [
  { status: "new", title: "New" },
  { status: "confirmed", title: "Confirmed" },
  { status: "handled", title: "Handled" },
];

export default function KanbanBoard() {
  const { enquiries, loading, error, setStatus, confirmBooking, deleteEnquiry } =
    useEnquiries();
  const [pending, setPending] = useState<Enquiry | null>(null);
  const [pendingDate, setPendingDate] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Enquiry | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const enquiry = enquiries.find((e) => e.id === active.id);
    const target = over.id as EnquiryStatus;
    if (!enquiry || enquiry.status === target) return;

    if (target === "confirmed") {
      setPending(enquiry);
      setPendingDate(enquiry.tourDate ?? enquiry.preferredDate ?? "");
      setConfirmError("");
      return;
    }
    setStatus(enquiry.id, target);
  }

  async function submitConfirm() {
    if (!pending || !pendingDate) return;
    const res = await confirmBooking(pending.id, pendingDate);
    if (!res.ok) {
      setConfirmError(res.error);
      return;
    }
    setPending(null);
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (error) return <p className="text-sm text-destructive">{error}</p>;

  return (
    <>
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {COLUMNS.map(({ status, title }) => (
            <KanbanColumn
              key={status}
              status={status}
              title={title}
              enquiries={enquiries.filter((e) => e.status === status)}
              onDelete={(id) => {
                const target = enquiries.find((e) => e.id === id);
                if (target) setDeleteTarget(target);
              }}
            />
          ))}
        </div>
      </DndContext>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this enquiry?"
        description={
          deleteTarget
            ? `${deleteTarget.name} · ${deleteTarget.tourName}. This cannot be undone.`
            : undefined
        }
        confirmLabel="Delete"
        destructive
        onConfirm={() => deleteTarget && deleteEnquiry(deleteTarget.id)}
      />

      <Dialog open={!!pending} onOpenChange={(open) => !open && setPending(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm booking</DialogTitle>
            <DialogDescription>
              Lock in a tour date for {pending?.name}. This sends the
              confirmation email.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-1.5">
            <Label htmlFor="tour-date">Tour date</Label>
            <Input
              id="tour-date"
              type="date"
              value={pendingDate}
              onChange={(e) => setPendingDate(e.target.value)}
            />
          </div>
          {confirmError && (
            <p className="text-sm text-destructive">{confirmError}</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPending(null)}>
              Cancel
            </Button>
            <Button disabled={!pendingDate} onClick={submitConfirm}>
              Confirm booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
