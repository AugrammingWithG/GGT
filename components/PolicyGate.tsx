"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { CANCELLATION_CLAUSES } from "@/lib/cancellationPolicy";
import { TERMS_CLAUSES } from "@/lib/termsAndConditions";

/**
 * The cancellation-policy / terms-and-conditions gate every booking path goes
 * through before checkout — the tour builder's enquiry flow and the fixed
 * "Book now" CTAs (header, footer) alike. Read in place, never a page
 * navigation, so the guest never loses whatever they were doing underneath.
 */
export default function PolicyGate({
  onAgree,
  onClose,
}: {
  onAgree: () => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"intro" | "cancellation" | "terms">("intro");
  const [agreed, setAgreed] = useState(false);

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" aria-label="Close" onClick={onClose}>
          ×
        </button>

        {step === "cancellation" || step === "terms" ? (
          <div>
            <h3>
              {step === "cancellation" ? "Cancellation policy" : "Terms & conditions"}
            </h3>
            <ul className="clause-list">
              {(step === "cancellation" ? CANCELLATION_CLAUSES : TERMS_CLAUSES).map(
                (c) => (
                  <li key={c.label}>
                    <strong>{c.label}.</strong> {c.text}
                  </li>
                ),
              )}
            </ul>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-ghost"
                style={{ flex: 1, justifyContent: "center" }}
                onClick={() => setStep("intro")}
              >
                ← Back
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h3>Before you dive in</h3>
            <p className="sub">
              Give our cancellation policy and terms &amp; conditions a quick
              read — just so there&apos;s no surprises later. Then we&apos;ll
              get you booked in.
            </p>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-ghost"
                style={{ flex: 1, justifyContent: "center" }}
                onClick={() => setStep("cancellation")}
              >
                Cancellation policy
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ flex: 1, justifyContent: "center" }}
                onClick={() => setStep("terms")}
              >
                Terms &amp; conditions
              </button>
            </div>

            <label className="policy-agree">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              I&apos;ve read and agree to the cancellation policy and terms
              &amp; conditions.
            </label>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-primary"
                disabled={!agreed}
                style={{ flex: 1, justifyContent: "center" }}
                onClick={onAgree}
              >
                Agree &amp; continue →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
