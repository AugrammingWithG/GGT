/**
 * Single source of truth for the terms and conditions' clauses — the client's
 * supplied wording, shown in full on /terms-and-conditions and in the enquiry
 * modal's booking gate. Do not add to, soften, or paraphrase.
 */
export const TERMS_CLAUSES = [
  {
    label: "Liability",
    text: "Gourmet Getaway Tours is not liable for illness, injury, damages, loss, delay or failure to join the tour due to factors beyond its control.",
  },
  {
    label: "Travel insurance",
    text: "Travel insurance is strongly recommended for all passengers.",
  },
  {
    label: "Changes to tours",
    text: "The company may alter routes, itineraries, fares, inclusions, days of operation, or cancel tours if unforeseen circumstances occur.",
  },
  {
    label: "Wine tasting",
    text: "Guests must be 18 or older to taste wine.",
  },
  {
    label: "Return time",
    text: "The 6pm return time is a guide, not a guarantee: traffic and unforeseen circumstances apply.",
  },
] as const;
