"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Price, { ChargedInAud } from "./Price";
import { FAREHARBOR_ENABLED, type FareHarborPrefill } from "@/lib/fareharbor";
import { openFareHarbor } from "@/lib/fareharbor.client";
import { CANCELLATION_CLAUSES } from "@/lib/cancellationPolicy";

type DraftAddOn = { id: string; name: string; price?: number };

export type EnquiryDraft = {
  tourId: string;
  tourName: string;
  guests: number;
  /** Extras we charge for. These, and only these, are inside `total`. */
  addOns: DraftAddOn[];
  /**
   * Third-party extras the guest pays direct on the day. Carried for the
   * record and the emails; deliberately kept out of `total`, and a `price` of
   * 0 means it varies. Never bill against these.
   */
  payOnDayAddOns: DraftAddOn[];
  total: number;
  /** FareHarbor item for the selected tour, if one is configured. */
  fareharborItemId?: string;
};

type Status = "idle" | "sending" | "ok" | "err";

export default function EnquiryModal({
  draft,
  onClose,
}: {
  draft: EnquiryDraft;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  // Guests only see the "policy" step when there's a real booking ahead
  // (FareHarbor enabled) — a plain enquiry with FareHarbor off never reaches
  // checkout, so there's nothing to gate yet.
  const [step, setStep] = useState<"form" | "policy">("form");

  /**
   * Everything the guest has told us so far, mapped onto FareHarbor's booking
   * flow. Selections FareHarbor has no field for (extras, our estimate) ride
   * along as tracking params so they show up on the booking in the dashboard.
   */
  function prefill(): FareHarborPrefill {
    return {
      itemId: draft.fareharborItemId || undefined,
      guests: draft.guests,
      date: preferredDate || undefined,
      name,
      email,
      phone,
      note: message,
      context: {
        tour: draft.tourName,
        extras: draft.addOns.map((a) => a.name).join(", "),
        // Separate param, so the booking record never reads these as ours to
        // charge. `estimate` stays the amount we quote.
        extrasPaidOnDay: draft.payOnDayAddOns.map((a) => a.name).join(", "),
        estimate: draft.total,
      },
    };
  }

  /**
   * The form's first submit only gets past browser validation and, when
   * there's a real booking ahead, into the cancellation-policy gate — never
   * straight to FareHarbor. Only "Agree & continue" from that gate (or a
   * plain enquiry with no FareHarbor) actually calls `submit`.
   */
  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (FAREHARBOR_ENABLED) {
      setStep("policy");
      return;
    }
    submit();
  }

  async function submit() {
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          tourId: draft.tourId,
          tourName: draft.tourName,
          guests: draft.guests,
          addOns: draft.addOns,
          payOnDayAddOns: draft.payOnDayAddOns,
          total: draft.total,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }
      setStatus("ok");
      // Lead is safely saved; hand the guest straight to FareHarbor to
      // actually book, carrying everything they just typed.
      openFareHarbor(prefill());
    } catch (err) {
      setStatus("err");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  // Portaled straight to <body>: rendered from inside .nature-page, whose
  // `isolation:isolate` traps this modal's z-index under its own stacking
  // context — below the fixed header's — so without the portal the header
  // paints over the top of the dimmed overlay and the dialog underneath it.
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" aria-label="Close" onClick={onClose}>
          ×
        </button>

        {status === "ok" ? (
          <>
            <h3>Thanks, {name || "friend"}! 🎉</h3>
            <p className="sub">
              {FAREHARBOR_ENABLED
                ? "Your details are saved and the booking window is opening: pick your date and confirm. Jimmy will be in touch either way."
                : "Your enquiry is in. Jimmy will be in touch shortly to lock in the details."}
            </p>
            <div className="modal-actions">
              {FAREHARBOR_ENABLED && (
                <button
                  className="btn btn-primary"
                  onClick={() => openFareHarbor(prefill())}
                >
                  Open booking →
                </button>
              )}
              <button className="btn btn-ghost" onClick={onClose}>
                Done
              </button>
            </div>
          </>
        ) : step === "policy" ? (
          <div>
            <h3>Cancellation policy</h3>
            <p className="sub">
              This applies once you continue — please read it before you head
              to checkout.
            </p>

            {status === "err" && (
              <div className="form-msg err">{error}</div>
            )}

            <ul className="policy-clauses">
              {CANCELLATION_CLAUSES.map((c) => (
                <li key={c.label}>
                  <strong>{c.label}.</strong> {c.text}
                </li>
              ))}
            </ul>
            <p className="policy-clauses-more">
              <Link href="/cancellation-policy" target="_blank">
                Read the full cancellation policy →
              </Link>
            </p>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setStep("form")}
                disabled={status === "sending"}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={status === "sending"}
                style={{ flex: 1, justifyContent: "center" }}
                onClick={submit}
              >
                {status === "sending" ? "Sending…" : "Agree & continue →"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit}>
            <h3>{FAREHARBOR_ENABLED ? "Almost there" : "Send your enquiry"}</h3>
            <p className="sub">
              {FAREHARBOR_ENABLED
                ? "A few details and we'll take you to checkout with everything filled in."
                : "We'll get back to you about your tailored day out."}
            </p>

            <div className="summary">
              <div className="row">
                <span>{draft.tourName}</span>
                <span>
                  {draft.guests} guest{draft.guests > 1 ? "s" : ""}
                </span>
              </div>
              {draft.addOns.map((a) => (
                <div className="row" key={a.id}>
                  <span>+ {a.name}</span>
                  <span>
                    {a.price === undefined ? (
                      "Price on request"
                    ) : a.price === 0 ? (
                      "Free"
                    ) : (
                      <Price aud={a.price * draft.guests} />
                    )}
                  </span>
                </div>
              ))}
              {/*
                No estimate row at all for a plain destination enquiry
                (gallery cards pass total: 0, addOns: []): showing "$0" would
                read as a real price rather than the absence of one.
                Pay-on-day extras are never part of the estimate, so they get
                their own list below regardless of whether this shows.
              */}
              {(draft.total > 0 || draft.addOns.length > 0) && (
                <>
                  <div className="row">
                    <b>Estimate</b>
                    <b>
                      <Price aud={draft.total} />
                    </b>
                  </div>
                  {/*
                    Last screen before checkout, so the amount that will
                    actually hit the card belongs here whenever the total
                    above is converted.
                  */}
                  <ChargedInAud aud={draft.total} className="summary-charged" />
                </>
              )}
              {draft.payOnDayAddOns.length > 0 && (
                <>
                  {draft.payOnDayAddOns.map((a) => (
                    <div className="row onday" key={a.id}>
                      <span>{a.name}</span>
                      <span>
                        {(a.price ?? 0) > 0 ? (
                          <>
                            ~<Price aud={(a.price ?? 0) * draft.guests} />
                          </>
                        ) : (
                          "Varies"
                        )}
                      </span>
                    </div>
                  ))}
                  <p className="summary-onday-note">
                    Paid direct to the provider on the day — not part of the
                    estimate and not charged by us.
                  </p>
                </>
              )}
            </div>

            {status === "err" && (
              <div className="form-msg err">{error}</div>
            )}

            <div className="field">
              <label className="flabel" htmlFor="enq-name">
                Your name
              </label>
              <input
                id="enq-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="flabel" htmlFor="enq-email">
                Email
              </label>
              <input
                id="enq-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="flabel" htmlFor="enq-phone">
                Phone (optional)
              </label>
              <input
                id="enq-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="flabel" htmlFor="enq-date">
                Preferred date (optional)
              </label>
              <input
                id="enq-date"
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="flabel" htmlFor="enq-message">
                Anything else? (optional)
              </label>
              <textarea
                id="enq-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={status === "sending"}
                style={{ flex: 1, justifyContent: "center" }}
              >
                {status === "sending"
                  ? "Sending…"
                  : FAREHARBOR_ENABLED
                    ? "Continue to booking →"
                    : "Send enquiry →"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
