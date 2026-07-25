"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase.client";
import AdminBackdrop from "./AdminBackdrop";

type AdminAuthValue = {
  user: User;
  authHeader: () => Promise<{ Authorization: string }>;
  signOutAdmin: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

/** Every /admin/(dashboard) route reads the signed-in admin through this. */
export function useAdminAuth(): AdminAuthValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

/**
 * Central auth guard for the admin dashboard: redirects to /admin/login when
 * signed out, otherwise provides the current user and an authHeader() helper
 * to every nested route — replaces the guard that used to live directly in
 * app/admin/page.tsx, duplicated per-page.
 */
export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    return onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.replace("/admin/login");
        return;
      }
      setUser(u);
      setChecking(false);
    });
  }, [router]);

  const authHeader = useCallback(async () => {
    const token = await user?.getIdToken();
    return { Authorization: `Bearer ${token}` };
  }, [user]);

  const signOutAdmin = useCallback(() => signOut(getFirebaseAuth()), []);

  if (checking || !user) {
    return (
      <div className="admin-root flex min-h-screen items-center justify-center">
        <AdminBackdrop />
        <p className="animate-in fade-in text-sm text-muted-foreground duration-700">
          Loading…
        </p>
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider value={{ user, authHeader, signOutAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
