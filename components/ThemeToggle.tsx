"use client";

import { useEffect, useState } from "react";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

export default function ThemeToggle() {
  // Matches whatever the blocking init script already put on <html> —
  // avoids a hydration mismatch and a flash between server and client.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private browsing / storage disabled — theme just won't persist.
    }
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
          <path
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
          />
        </svg>
      ) : (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            fill="currentColor"
            d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a.6.6 0 0 0-.75-.8A9.5 9.5 0 1 0 21.3 15.35a.6.6 0 0 0-.8-.75Z"
          />
        </svg>
      )}
    </button>
  );
}
