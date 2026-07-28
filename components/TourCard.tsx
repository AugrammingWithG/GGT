"use client";

import { useState } from "react";
import Price from "./Price";
import BookingCta from "./BookingCta";
import EnquiryModal, { type EnquiryDraft } from "./EnquiryModal";
import { FAREHARBOR_FLAGSHIP_ITEM_ID } from "@/lib/fareharbor";

export type TourCardProps = {
  id: string;
  image: string;
  focus?: string;
  label: string;
  name: string;
  blurb: string;
  /** Confirmed per-adult rate in AUD, when one exists. */
  fromPriceAud?: number;
  /** Hunter Valley only — the one tour bookable straight online. */
  online?: boolean;
  /** The flagship card — larger photo/type, spans extra grid columns. */
  featured?: boolean;
};

export default function TourCard({
  id,
  image,
  focus,
  label,
  name,
  blurb,
  fromPriceAud,
  online,
  featured,
}: TourCardProps) {
  const [enquiring, setEnquiring] = useState(false);

  const draft: EnquiryDraft = {
    tourId: id,
    tourName: name,
    guests: 2,
    addOns: [],
    payOnDayAddOns: [],
    total: 0,
  };

  // A confirmed price always gets the compact "from $X · book/enquire" row.
  // With no confirmed price, a lone "Priced on enquiry" line repeated across
  // most cards read as broken rather than bespoke — so those cards skip the
  // price line entirely and let the Enquire button carry the row instead.
  const hasPrice = fromPriceAud != null;

  return (
    <div className={featured ? "tour-card featured" : "tour-card"}>
      <div
        className="tour-photo"
        style={{
          backgroundImage: `url(${image})`,
          backgroundPosition: focus ?? "center",
        }}
      >
        <span>{label}</span>
      </div>
      <div className="tour-body">
        {online && <span className="tag-online">Book online</span>}
        <h3>{name}</h3>
        <p className="line">{blurb}</p>
        <div className="tour-foot">
          {hasPrice && (
            <div className="from">
              From
              <b>
                <Price aud={fromPriceAud} /> pp
              </b>
            </div>
          )}
          {online ? (
            <BookingCta
              itemId={FAREHARBOR_FLAGSHIP_ITEM_ID || undefined}
              className="btn btn-wine"
            >
              Book now
            </BookingCta>
          ) : (
            <button
              type="button"
              className={hasPrice ? "btn btn-outline" : "btn btn-wine tour-enquire-solo"}
              onClick={() => setEnquiring(true)}
            >
              Enquire
            </button>
          )}
        </div>
      </div>
      {enquiring && (
        <EnquiryModal draft={draft} onClose={() => setEnquiring(false)} />
      )}
    </div>
  );
}
