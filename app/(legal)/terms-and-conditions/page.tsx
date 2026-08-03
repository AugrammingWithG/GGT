import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Terms and conditions, refunds and returns policy for ${SITE_NAME}.`,
};

const CLAUSES: { label: string; paragraphs: React.ReactNode[] }[] = [
  {
    label: "General",
    paragraphs: [
      <>
        If a tour we operate is cancelled by our business due to an act of
        God or extreme weather event, a full refund will be offered to the
        customer. The customer may choose to transfer to a newly nominated
        day tour date, subject to availability. An act of God and/or extreme
        weather event includes but is not limited to flood, heavy rain that
        may cause flood, fire, extreme heat, earthquake or tremor, or high
        winds that may deem the areas travelling unsafe for participants.
      </>,
      <>
        Where refunds apply, the full refund will be placed in the
        customer&apos;s nominated bank account or returned to the nominated
        credit card within 30 days from our business being notified.
      </>,
      <>
        By using our online secure gateway, you agree to be legally bound by
        these Terms &amp; Conditions, which take effect immediately. If you
        do not agree to be legally bound by all of these Terms &amp;
        Conditions, please do not continue with your online booking. In all
        cases, the person making the booking is deemed to have accepted
        these Terms and Conditions on behalf of every other person named in
        the booking who takes part in the booked tour(s).
      </>,
    ],
  },
  {
    label: "Cancellations",
    paragraphs: [
      <>
        Public tours may be cancelled or altered up to 24 hours prior to the
        departure time with no cancellation fee. Cancellations within 24
        hours of departure incur a 100% charge (no refund).
      </>,
      <>
        Private tours require a $500 deposit to secure the date. Full
        payment is required at least one week prior to the tour. A full
        refund is given if a private tour is cancelled outside of 5 days of
        the tour date; no refund applies if cancelled inside 5 days of the
        tour commencement date.
      </>,
      <>No-shows will be charged the full tour price, no refunds.</>,
      <>
        Gift vouchers are non-refundable and cannot be transferred for cash.
        A customer has 3 years to use their gift voucher.
      </>,
    ],
  },
  {
    label: "Pricing & guests",
    paragraphs: [
      <>
        All prices are in Australian dollars and inclusive of GST. Prices
        are subject to change without notice. Guests must be 18 years or
        over to taste the wines, beers, cider or spirits.
      </>,
      <>
        Children 4&ndash;16 must occupy their own seat, and their age needs
        to be advised at the time of booking.
      </>,
    ],
  },
  {
    label: "Health & safety",
    paragraphs: [
      <>
        Any customer with a history of motion sickness that may result in
        them falling ill must advise the company in advance, or the driver
        on the day.
      </>,
    ],
  },
  {
    label: "Insurance",
    paragraphs: [
      <>
        {SITE_NAME} Pty Ltd holds public liability insurance through
        Allianz, covering all aspects of our business. We highly recommend
        having your own personal or travel insurance whilst on any tour.
      </>,
    ],
  },
  {
    label: "Lost property",
    paragraphs: [
      <>
        At the conclusion of every day, our bus is thoroughly checked for
        any property left behind. We will attempt to contact the rightful
        owner; if this can&apos;t be achieved, the item is documented in our
        lost property register and kept for a period of 12 months.
      </>,
    ],
  },
];

export default function TermsAndConditions() {
  return (
    <>
      <p className="eyebrow">Legal</p>
      <h1 className="legal-title">Terms &amp; Conditions</h1>

      <div className="legal-prose">
        <p>
          This document outlines the terms and conditions, refunds and
          returns policies of {SITE_NAME} Pty Ltd. Cancellation policies may
          vary depending on agreements with inbound operators, travel
          agents, online travel agencies (OTAs) or other partners &mdash; if
          you book directly with us, the policy below applies.
        </p>
      </div>

      <dl className="legal-ids">
        <div>
          <dt>Public tour cancellation</dt>
          <dd>24 hrs notice</dd>
        </div>
        <div>
          <dt>Private tour deposit</dt>
          <dd>$500</dd>
        </div>
        <div>
          <dt>Private tour cancellation</dt>
          <dd>5 days notice</dd>
        </div>
        <div>
          <dt>Refund processing</dt>
          <dd>within 30 days</dd>
        </div>
        <div>
          <dt>Gift voucher validity</dt>
          <dd>3 years</dd>
        </div>
      </dl>

      <ol className="legal-list">
        {CLAUSES.map((clause, i) => (
          <li className="legal-item" key={i}>
            <div>
              <span className="legal-label">{clause.label}</span>
              {clause.paragraphs.length > 1 ? (
                <ul className="legal-points">
                  {clause.paragraphs.map((paragraph, j) => (
                    <li key={j}>{paragraph}</li>
                  ))}
                </ul>
              ) : (
                <p>{clause.paragraphs[0]}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
