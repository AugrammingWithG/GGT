"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "./admin-auth";
import type { Enquiry, EnquiryStatus } from "./types";

/** Loads enquiries and exposes the status-change/confirm/delete mutations shared by Overview and the Enquiries kanban. */
export function useEnquiries() {
  const { authHeader } = useAdminAuth();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const headers = await authHeader();
      const res = await fetch("/api/enquiries", { headers });
      if (res.status === 401) {
        setError("Your account isn't on the admin allowlist (ADMIN_EMAILS).");
        return;
      }
      const data = await res.json();
      setEnquiries(data.enquiries ?? []);
    } catch {
      setError("Failed to load enquiries.");
    } finally {
      setLoading(false);
    }
  }, [authHeader]);

  useEffect(() => {
    reload();
  }, [reload]);

  async function setStatus(id: string, status: EnquiryStatus) {
    const headers = { ...(await authHeader()), "Content-Type": "application/json" };
    const prev = enquiries;
    setEnquiries((list) => list.map((e) => (e.id === id ? { ...e, status } : e)));
    const res = await fetch(`/api/enquiries/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
    });
    if (!res.ok) setEnquiries(prev);
    return res.ok;
  }

  async function confirmBooking(id: string, tourDate: string) {
    const headers = { ...(await authHeader()), "Content-Type": "application/json" };
    const res = await fetch(`/api/enquiries/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status: "confirmed", tourDate }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      return { ok: false as const, error: d.error ?? "Failed to confirm booking." };
    }
    setEnquiries((list) =>
      list.map((e) => (e.id === id ? { ...e, status: "confirmed", tourDate } : e)),
    );
    return { ok: true as const };
  }

  async function deleteEnquiry(id: string) {
    const headers = await authHeader();
    const res = await fetch(`/api/enquiries/${id}`, { method: "DELETE", headers });
    if (!res.ok) return false;
    setEnquiries((list) => list.filter((e) => e.id !== id));
    return true;
  }

  return { enquiries, loading, error, reload, setStatus, confirmBooking, deleteEnquiry };
}
