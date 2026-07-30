"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { PartyPopper } from "lucide-react";
import Price, { ChargedInAud } from "./Price";
import { FAREHARBOR_ENABLED } from "@/lib/fareharbor";
import { openFareHarbor } from "@/lib/fareharbor.client";

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
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
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
    } catch (err) {
      setStatus("err");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  // With FareHarbor configured, its own checkout collects name/email/date and
  // presents its own cancellation policy and terms & conditions — asking
  // again on-site is the redundant double-entry step we're removing. Guests
  // go straight to booking; the plain enquiry form (and its /api/enquiries
  // lead record) only exists as the fallback for when there's no FareHarbor
  // checkout to hand off to.
  useEffect(() => {
    if (!FAREHARBOR_ENABLED) return;
    openFareHarbor({
      itemId: draft.fareharborItemId || undefined,
      guests: draft.guests,
      context: {
        tour: draft.tourName,
        extras: draft.addOns.map((a) => a.name).join(", "),
        extrasPaidOnDay: draft.payOnDayAddOns.map((a) => a.name).join(", "),
        estimate: draft.total,
      },
    });
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (FAREHARBOR_ENABLED) {
    return null;
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
            <h3>
              Thanks, {name || "friend"}! <PartyPopper size={22} color="var(--wine-solid)" strokeWidth={1.75} style={{ verticalAlign: "-4px" }} />
            </h3>
            <p className="sub">
              Your enquiry is in. Jimmy will be in touch shortly to lock in
              the details.
            </p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={onClose}>
                Done
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleFormSubmit}>
            <h3>Send your enquiry</h3>
            <p className="sub">
              We&apos;ll get back to you about your tailored day out.
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
                    Paid direct to the provider on the day, not part of the
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
                {status === "sending" ? "Sending…" : "Send enquiry →"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
