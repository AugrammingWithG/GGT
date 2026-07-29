"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { PrivateTourRate } from "@/lib/tours";
import { PRIVATE_TOUR_RATE, privateTourEstimate } from "@/lib/tours";
import { money } from "@/lib/money";
import { useAdminAuth } from "./admin-auth";
import { useTours } from "./useTours";

const PREVIEW_GUESTS = [2, 4, 6, 8];

function num(v: string): number | undefined {
  return v === "" ? undefined : Number(v);
}

export default function PricingForm() {
  const { authHeader } = useAdminAuth();
  const [rate, setRate] = useState<PrivateTourRate>(PRIVATE_TOUR_RATE);
  const [loading, setLoading] = useState(true);
  const [savingRate, setSavingRate] = useState(false);
  const [rateMsg, setRateMsg] = useState("");

  useEffect(() => {
    (async () => {
      const headers = await authHeader();
      const res = await fetch("/api/settings/pricing", { headers });
      if (res.ok) {
        const data = await res.json();
        setRate(data.rate);
      }
      setLoading(false);
    })();
  }, [authHeader]);

  async function saveRate() {
    setSavingRate(true);
    setRateMsg("");
    const headers = { ...(await authHeader()), "Content-Type": "application/json" };
    const res = await fetch("/api/settings/pricing", {
      method: "PUT",
      headers,
      body: JSON.stringify(rate),
    });
    setSavingRate(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setRateMsg(d.error ?? "Failed to save.");
      return;
    }
    setRateMsg("Saved — the public booking widget now quotes from this rate.");
  }

  const { tours, saveTour } = useTours();
  const hunterValley = tours.find((t) => t.id === "hunter-valley");
  const [hv, setHv] = useState<{
    priceAdult?: number;
    priceSenior?: number;
    priceChild?: number;
  }>({});
  const [savingHv, setSavingHv] = useState(false);
  const [hvMsg, setHvMsg] = useState("");

  useEffect(() => {
    if (hunterValley) {
      setHv({
        priceAdult: hunterValley.priceAdult,
        priceSenior: hunterValley.priceSenior,
        priceChild: hunterValley.priceChild,
      });
    }
  }, [hunterValley]);

  async function saveHv() {
    if (!hunterValley) return;
    setSavingHv(true);
    setHvMsg("");
    const res = await saveTour({ ...hunterValley, ...hv });
    setSavingHv(false);
    setHvMsg(res.ok ? "Saved." : res.error);
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <CardHeader>
          <CardTitle>Private tour rate</CardTitle>
          <CardDescription>
            Every tour except Hunter Valley. Shown to guests as a live
            estimate in the booking widget.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Base rate (A$)</Label>
              <Input
                type="number"
                value={rate.base}
                onChange={(e) => setRate({ ...rate, base: Number(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Extra guest (A$)</Label>
              <Input
                type="number"
                value={rate.extraGuestPrice}
                onChange={(e) =>
                  setRate({ ...rate, extraGuestPrice: Number(e.target.value) })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Base covers (min)</Label>
              <Input
                type="number"
                value={rate.baseCoversMin}
                onChange={(e) =>
                  setRate({ ...rate, baseCoversMin: Number(e.target.value) })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Base covers (max)</Label>
              <Input
                type="number"
                value={rate.baseCoversMax}
                onChange={(e) =>
                  setRate({ ...rate, baseCoversMax: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Max guests</Label>
            <Input
              type="number"
              value={rate.maxGuests}
              onChange={(e) => setRate({ ...rate, maxGuests: Number(e.target.value) })}
            />
          </div>
          <div className="grid gap-2">
            <Label>Includes (comma-separated)</Label>
            <Input
              value={rate.includes.join(", ")}
              onChange={(e) =>
                setRate({
                  ...rate,
                  includes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                })
              }
            />
          </div>

          <div className="border-t border-white/10 pt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Guest preview
            </p>
            <div className="mt-3 grid grid-cols-4 divide-x divide-white/10">
              {PREVIEW_GUESTS.map((g) => (
                <div key={g} className="min-w-0 truncate text-center">
                  <p className="truncate text-[11px] text-muted-foreground">{g} guests</p>
                  <p className="mt-0.5 truncate font-mono text-sm font-semibold text-[var(--gold)]">
                    {money(privateTourEstimate(rate, g))}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <Button onClick={saveRate} disabled={savingRate}>
              {savingRate ? "Saving…" : "Save rate"}
            </Button>
            {rateMsg && (
              <p
                className={`animate-in fade-in text-sm ${rateMsg.startsWith("Saved") ? "text-[var(--gold)]" : "text-destructive"}`}
              >
                {rateMsg}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card
        className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500"
        style={{ animationDelay: "80ms" }}
      >
        <CardHeader>
          <CardTitle>Hunter Valley (per person)</CardTitle>
          <CardDescription>
            The only tour priced per age tier rather than the private-tour
            rate above.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {!hunterValley ? (
            <p className="text-sm text-muted-foreground">Loading tour…</p>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-2">
                  <Label>Adult</Label>
                  <Input
                    type="number"
                    value={hv.priceAdult ?? ""}
                    onChange={(e) => setHv({ ...hv, priceAdult: num(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Senior</Label>
                  <Input
                    type="number"
                    value={hv.priceSenior ?? ""}
                    onChange={(e) => setHv({ ...hv, priceSenior: num(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Child (5-17)</Label>
                  <Input
                    type="number"
                    value={hv.priceChild ?? ""}
                    onChange={(e) => setHv({ ...hv, priceChild: num(e.target.value) })}
                  />
                </div>
              </div>

              <div className="border-t border-white/10 pt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Example party: 2 adults, 1 senior, 2 children
                </p>
                <p className="mt-2 font-mono text-lg font-semibold text-[var(--gold)]">
                  {money(
                    2 * (hv.priceAdult ?? 0) +
                      1 * (hv.priceSenior ?? 0) +
                      2 * (hv.priceChild ?? 0),
                  )}
                </p>
              </div>

              {hunterValley.inclusions && hunterValley.inclusions.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Included
                  </p>
                  <ul className="mt-2 grid gap-1 text-sm text-white/80">
                    {hunterValley.inclusions.map((inc) => (
                      <li key={inc} className="flex items-start gap-2">
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[var(--gold)]" />
                        {inc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-3 pt-1">
                <Button onClick={saveHv} disabled={savingHv}>
                  {savingHv ? "Saving…" : "Save Hunter Valley prices"}
                </Button>
                {hvMsg && (
                  <p
                    className={`animate-in fade-in text-sm ${hvMsg === "Saved." ? "text-[var(--gold)]" : "text-destructive"}`}
                  >
                    {hvMsg}
                  </p>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
