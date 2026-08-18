import { BUSINESS_EMAIL, BUSINESS_PHONE } from "@/lib/seo";

/**
 * Sits inside a failed-submit message. If the enquiry can't get through —
 * Firestore down, the guest offline, a bad deploy — they still leave with a
 * way to reach Jimmy rather than a dead end, which is the whole point of the
 * enquiry button they just pressed.
 */
export default function ContactFallback() {
  return (
    <>
      Or reach Jimmy directly on{" "}
      <a href={`tel:${BUSINESS_PHONE}`}>0416 139 567</a> or{" "}
      <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a>.
    </>
  );
}
