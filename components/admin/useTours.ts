"use client";

import { useCallback, useEffect, useState } from "react";
import type { Tour } from "@/lib/tours";
import { useAdminAuth } from "./admin-auth";

/** Loads tours and exposes the save/delete mutations shared by Pricing (Hunter Valley rates) and Tours. */
export function useTours() {
  const { authHeader } = useAdminAuth();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/tours");
      const data = await res.json();
      setTours(data.tours ?? []);
    } catch {
      setError("Failed to load tours.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  async function saveTour(tour: Tour) {
    const headers = { ...(await authHeader()), "Content-Type": "application/json" };
    const res = await fetch("/api/tours", {
      method: "PUT",
      headers,
      body: JSON.stringify(tour),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      return { ok: false as const, error: d.error ?? "Failed to save tour." };
    }
    await reload();
    return { ok: true as const };
  }

  async function deleteTour(id: string) {
    const headers = await authHeader();
    await fetch(`/api/tours?id=${encodeURIComponent(id)}`, { method: "DELETE", headers });
    await reload();
  }

  return { tours, loading, error, reload, saveTour, deleteTour };
}
