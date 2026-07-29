import type { Metadata } from "next";
import Link from "next/link";
import { CANCELLATION_CLAUSES } from "@/lib/cancellationPolicy";

export const metadata: Metadata = {
  title: "Cancellation policy",
  description:
    "How payment, cancellations and refunds work for Gourmet Getaway Tours private tours.",
  alternates: {
    canonical: "/cancellation-policy",
  },
};

/*
  Every clause below is the client's supplied wording. Nothing here may be
  added to, softened or "rounded out" without the client saying so — on a legal
  page an invented clause is worse than a missing one.
*/
export default function CancellationPolicy() {
  return (
    <>
      <p className="eyebrow">Legal</p>
      <h1 className="legal-title">Cancellation policy</h1>

      <ol className="legal-list">
        {CANCELLATION_CLAUSES.map((c) => (
          <li className="legal-item" key={c.label}>
            <div>
              <span className="legal-label">{c.label}</span>
              <p>{c.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="legal-more">
        <Link href="/terms-and-conditions">Terms and conditions</Link>
      </p>
    </>
  );
}
