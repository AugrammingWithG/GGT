"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import TourCard from "@/components/admin/TourCard";
import TourEditor from "@/components/admin/TourEditor";
import { useTours } from "@/components/admin/useTours";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DEFAULT_MAX_GUESTS, type Tour } from "@/lib/tours";

function CreateTourForm({ onCreate }: { onCreate: (t: Tour) => void }) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function create() {
    const slug = id.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    if (!slug || !name.trim()) {
      setError("Enter an id (slug) and a name.");
      return;
    }
    onCreate({ id: slug, name: name.trim(), max: DEFAULT_MAX_GUESTS, addOns: [] });
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label>Tour name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tour name" />
      </div>
      <div className="grid gap-2">
        <Label>Id (slug)</Label>
        <Input value={id} onChange={(e) => setId(e.target.value)} placeholder="id-slug" />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button onClick={create} className="w-fit">
        <Plus className="size-3.5" />
        Create
      </Button>
    </div>
  );
}

export default function ToursPage() {
  const { tours, loading, saveTour, deleteTour } = useTours();
  const [editing, setEditing] = useState<Tour | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Tour | null>(null);

  return (
    <div className="flex animate-in flex-col gap-6 fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-3xl font-semibold text-white">Tours</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Itinerary, capacity and add-ons. Base rates live on the Pricing tab. Click a tour to edit it.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
          {tours.map((t, i) => (
            <TourCard
              key={t.id}
              tour={t}
              onOpen={() => setEditing(t)}
              style={{ animationDelay: `${i * 50}ms` }}
            />
          ))}
          <Card
            onClick={() => setCreating(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setCreating(true)}
            className="flex h-full min-h-[168px] w-full cursor-pointer items-center justify-center border-dashed py-0 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--gold)]/50"
          >
            <CardContent className="flex flex-col items-center gap-2 p-5 text-muted-foreground">
              <Plus className="size-6" />
              <span className="text-sm font-medium">Add a tour</span>
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit tour</DialogTitle>
            <DialogDescription className="sr-only">
              Edit itinerary, capacity and add-ons for this tour.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <TourEditor
              tour={editing}
              onSave={async (t) => {
                await saveTour(t);
                setEditing(null);
              }}
              onDelete={() => {
                setDeleteTarget(editing);
                setEditing(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new tour</DialogTitle>
          </DialogHeader>
          <CreateTourForm
            onCreate={async (t) => {
              await saveTour(t);
              setCreating(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this tour?"
        description={
          deleteTarget ? `"${deleteTarget.name}" (${deleteTarget.id}). This cannot be undone.` : undefined
        }
        confirmLabel="Delete"
        destructive
        onConfirm={() => deleteTarget && deleteTour(deleteTarget.id)}
      />
    </div>
  );
}
