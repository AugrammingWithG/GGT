import type { Metadata } from "next";
import Link from "next/link";
import { ACCREDITATION_NUMBER, BUSINESS_ACN } from "@/lib/seo";
import { TERMS_CLAUSES } from "@/lib/termsAndConditions";

export const metadata: Metadata = {
  title: "Terms and conditions",
  description:
    "Terms and conditions for travelling with Gourmet Getaway Tours: liability, travel insurance, changes to tours and age requirements.",
  alternates: {
    canonical: "/terms-and-conditions",
  },
};

/*
  Every clause below is the client's supplied wording. Nothing here may be
  added to, softened or "rounded out" without the client saying so — on a legal
  page an invented clause is worse than a missing one.
*/
export default function TermsAndConditions() {
  return (
    <>
      <p className="eyebrow">Legal</p>
      <h1 className="legal-title">Terms and conditions</h1>

      <ol className="legal-list">
        {TERMS_CLAUSES.map((c) => (
          <li className="legal-item" key={c.label}>
            <div>
              <span className="legal-label">{c.label}</span>
              <p>{c.text}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* Registered identifiers, kept out of the numbered clauses — they say
          who the operator is, they are not terms a guest agrees to. */}
      <dl className="legal-ids">
        <div>
          <dt>Accreditation number</dt>
          <dd>{ACCREDITATION_NUMBER}</dd>
        </div>
        <div>
          <dt>ACN</dt>
          <dd>{BUSINESS_ACN}</dd>
        </div>
      </dl>

      <p className="legal-more">
        <Link href="/cancellation-policy">Cancellation policy</Link>
      </p>
    </>
  );
}
