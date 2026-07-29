export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "ggt-theme";

/**
 * Resolves the theme before React hydrates: stored preference if the visitor
 * has toggled before, else light — light is the default regardless of OS
 * setting, only switching once someone opts in via ThemeToggle. Inlined into
 * a blocking <script> in app/layout.tsx (see `themeInitScript`) so
 * <html data-theme> is correct on first paint — no flash of the wrong theme.
 */
export function themeInitScript(): string {
  return `(function(){try{
    var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    document.documentElement.setAttribute("data-theme",t==="dark"?"dark":"light");
  }catch(e){}})();`;
}
