"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Tour } from "@/lib/tours";

/**
 * Full edit form for one tour — rendered inside a Dialog (see ToursPage), not
 * its own Card: the Dialog already provides the glass panel, so wrapping
 * this in a second Card would nest two rounded/bordered boxes and look like
 * overlapping shapes rather than one considered surface.
 */
export default function TourEditor({
  tour,
  onSave,
  onDelete,
}: {
  tour: Tour;
  onSave: (t: Tour) => void;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState<Tour>(tour);
  const [saving, setSaving] = useState(false);

  function updateAddon(idx: number, patch: Partial<Tour["addOns"][number]>) {
    setDraft((d) => ({
      ...d,
      addOns: d.addOns.map((a, i) => (i === idx ? { ...a, ...patch } : a)),
    }));
  }

  async function save() {
    setSaving(true);
    await onSave(draft);
    setSaving(false);
  }

  return (
    <div className="grid gap-5">
      <div>
        <Label>Tour name</Label>
        <Input
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          className="mt-2 text-base font-semibold"
        />
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          id: {draft.id} · booking CTA opens{" "}
          {draft.fareharborItemId
            ? `FareHarbor item ${draft.fareharborItemId}`
            : "the full FareHarbor item list"}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="grid gap-2">
          <Label>Min guests</Label>
          <Input
            type="number"
            value={draft.min ?? ""}
            onChange={(e) =>
              setDraft({
                ...draft,
                min: e.target.value === "" ? undefined : Number(e.target.value),
              })
            }
            placeholder="Blank = negotiated"
          />
        </div>
        <div className="grid gap-2">
          <Label>Max guests</Label>
          <Input
            type="number"
            value={draft.max}
            onChange={(e) => setDraft({ ...draft, max: Number(e.target.value) })}
          />
        </div>
        <div className="grid gap-2">
          <Label>FareHarbor ID</Label>
          <Input
            value={draft.fareharborItemId ?? ""}
            onChange={(e) => setDraft({ ...draft, fareharborItemId: e.target.value.trim() })}
            placeholder="e.g. 123456"
          />
        </div>
      </div>

      <div className="grid gap-3">
        <Label>Add-ons</Label>
        {draft.addOns.length === 0 && (
          <p className="text-sm text-muted-foreground">No add-ons yet.</p>
        )}
        {draft.addOns.map((a, i) => (
          <div
            key={a.id}
            className="grid gap-3 rounded-lg border border-border bg-muted/60 p-3.5"
          >
            <div className="flex items-center gap-3">
              <Input
                value={a.name}
                onChange={(e) => updateAddon(i, { name: e.target.value })}
                placeholder="Add-on name"
                className="flex-1"
              />
              <Input
                type="number"
                value={a.price ?? ""}
                onChange={(e) =>
                  updateAddon(i, {
                    price: e.target.value === "" ? undefined : Number(e.target.value),
                  })
                }
                placeholder={a.payOnDay ? "Approx (0=varies)" : "Price"}
                className="w-32 shrink-0"
              />
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    addOns: d.addOns.filter((_, idx) => idx !== i),
                  }))
                }
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-1.5 whitespace-nowrap text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={!!a.payOnDay}
                  onChange={(e) => updateAddon(i, { payOnDay: e.target.checked })}
                />
                Paid on the day
              </label>
              <label className="flex items-center gap-1.5 whitespace-nowrap text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={!!a.subjectToAvailability}
                  onChange={(e) => updateAddon(i, { subjectToAvailability: e.target.checked })}
                />
                Limited availability
              </label>
              <Input
                value={a.note ?? ""}
                onChange={(e) => updateAddon(i, { note: e.target.value || undefined })}
                placeholder="Note (optional)"
                className="min-w-40 flex-1"
              />
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() =>
            setDraft((d) => ({
              ...d,
              addOns: [...d.addOns, { id: `addon-${Date.now()}`, name: "New add-on", price: 0 }],
            }))
          }
        >
          <Plus className="size-3.5" />
          Add-on
        </Button>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <Button variant="ghost" onClick={onDelete} className="text-destructive hover:text-destructive">
          <Trash2 className="size-3.5" />
          Delete tour
        </Button>
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
