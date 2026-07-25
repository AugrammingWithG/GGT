/**
 * Single source of truth for the cancellation policy's clauses — the client's
 * supplied wording, shown in full on /cancellation-policy and summarised in
 * the enquiry modal's booking gate. Do not add to, soften, or paraphrase.
 */
export const CANCELLATION_CLAUSES = [
  {
    label: "Securing a date",
    text: "Private tours require full payment to secure a specific date.",
  },
  {
    label: "Full refund",
    text: "Full refund if cancelled more than 5 days before the tour date.",
  },
  {
    label: "No refund",
    text: "No refund if cancelled within 5 days of the tour date.",
  },
] as const;
