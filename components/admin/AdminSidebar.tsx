"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  KanbanSquare,
  DollarSign,
  Map,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "./admin-auth";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/enquiries", label: "Enquiries", icon: KanbanSquare },
  { href: "/admin/pricing", label: "Pricing", icon: DollarSign },
  { href: "/admin/tours", label: "Tours", icon: Map },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, signOutAdmin } = useAdminAuth();

  return (
    <aside className="sticky top-0 z-20 flex h-screen w-72 shrink-0 flex-col justify-between overflow-hidden border-r border-sidebar-border bg-sidebar px-4 py-7 text-sidebar-foreground shadow-[0_0_40px_rgba(0,0,0,.35)] backdrop-blur-xl animate-in slide-in-from-left-4 fade-in duration-500">
      {/* Decorative fill for the empty space below the nav — a soft gold glow
          anchored to the logo and a faint watermark mark, so the panel reads
          as a considered glass surface rather than an empty dark void. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-24 size-72 rounded-full bg-[var(--gold)]/18 blur-[90px]"
      />
      <Image
        aria-hidden
        src="/images/ggt-mark.png"
        alt=""
        width={260}
        height={260}
        className="pointer-events-none absolute -bottom-10 left-1/2 w-64 -translate-x-1/2 opacity-[0.05] grayscale"
      />

      <div className="relative z-10">
        <Link
          href="/admin"
          className="mb-7 flex items-center gap-3 rounded-lg px-2 py-1.5 transition-opacity hover:opacity-80"
        >
          <Image
            src="/images/Untitled-design-19.png"
            alt=""
            width={46}
            height={46}
            className="size-11 shrink-0 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,.4)]"
          />
          <div>
            <p className="text-base font-semibold leading-tight text-white">
              Gourmet Getaway
            </p>
            <p className="text-xs text-sidebar-foreground/60">Admin dashboard</p>
          </div>
        </Link>
        <div className="mb-6 h-px bg-gradient-to-r from-[var(--gold)]/40 via-white/10 to-transparent" />
        <nav className="flex flex-col gap-2">
          {NAV.map(({ href, label, icon: Icon }, i) => {
            const active =
              href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                style={{ animationDelay: `${i * 40}ms` }}
                className={cn(
                  "animate-in fade-in slide-in-from-left-2 relative flex items-center gap-3 rounded-xl border px-4 py-3 text-[15px] font-medium fill-mode-both transition-all duration-200",
                  active
                    ? "border-[rgba(244,180,0,.35)] bg-sidebar-primary text-sidebar-primary-foreground"
                    : "border-transparent text-sidebar-foreground/80 hover:translate-x-0.5 hover:border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                {active && (
                  <span className="absolute -left-4 h-5 w-1 rounded-r-full bg-[var(--gold)]" />
                )}
                <Icon className={cn("size-5", active && "text-[var(--gold)]")} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="relative z-10 border-t border-sidebar-border pt-5">
        <p className="mb-2.5 truncate px-4 text-sm text-sidebar-foreground/60">
          {user.email}
        </p>
        <button
          onClick={() => signOutAdmin()}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-sidebar-foreground/80 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="size-5" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
