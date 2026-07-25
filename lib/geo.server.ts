import "server-only";
import { headers } from "next/headers";

/**
 * Best-effort visitor country from Vercel's request headers.
 *
 * This is only a hint: VPNs, corporate proxies and mobile carriers can
 * misreport locations, so the visitor can always override it with the picker.
 */
export async function detectCountry(): Promise<string | null> {
  const h = await headers();
  const country = h.get("x-vercel-ip-country");
  return country ? country.trim().toUpperCase() : null;
}
