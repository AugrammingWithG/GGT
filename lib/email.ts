import "server-only";
import { money } from "./money";
import { buildIcs, googleCalendarUrl } from "./calendar";

/** Fields captured when a guest submits an enquiry. */
export type EnquiryFields = {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  tourName: string;
  guests: number;
  addOns: { id: string; name: string; price: number }[];
  /**
   * Third-party extras the guest pays direct on the day. Listed separately
   * in every email below `total`, never folded into it — a price of 0 means
   * it varies rather than being free.
   */
  payOnDayAddOns: { id: string; name: string; price: number }[];
  total: number;
  /** "YYYY-MM-DD" */
  preferredDate: string;
  /** Compass region for private-tour enquiries; blank for other enquiry sources. */
  region?: string;
};

/** A confirmed booking — an enquiry with a locked-in tour date. */
export type BookingFields = EnquiryFields & {
  id: string;
  /** "YYYY-MM-DD" */
  tourDate: string;
};

/**
 * Returns a configured Resend client + the shared "from" address, or null if
 * email isn't configured. Every send is best-effort: callers log and continue,
 * so a missing key or send failure never blocks the booking flow.
 */
async function getResend(): Promise<{ resend: import("resend").Resend; from: string } | null> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM_EMAIL;
  if (!apiKey || !from) {
    console.warn("Email skipped: RESEND_API_KEY / ENQUIRY_FROM_EMAIL missing.");
    return null;
  }
  const { Resend } = await import("resend");
  return { resend: new Resend(apiKey), from };
}

/** Formats "2026-08-05" as "Wednesday, 5 August 2026" without timezone drift. */
function prettyDate(ymd: string): string {
  if (!ymd) return "Flexible / not specified";
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12));
  return dt.toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function addOnsLine(addOns: EnquiryFields["addOns"]): string {
  return addOns.length ? addOns.map((a) => a.name).join(", ") : "None";
}

function guestsLabel(n: number): string {
  return `${n} guest${n > 1 ? "s" : ""}`;
}

/** Only private-tour enquiries carry a region — omitted entirely for other flows. */
function regionLine(region?: string): string[] {
  return region ? [`Region of interest: ${region}`] : [];
}

/** Business inbox recipients — ENQUIRY_TO_EMAIL may be one address or several, comma-separated. */
function businessRecipients(): string[] {
  return (process.env.ENQUIRY_TO_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

/**
 * Pay-on-the-day extras with their guide prices, for the plain-text emails
 * below. Never totalled — a sum here would read as an amount owed to us,
 * which is exactly what these aren't.
 */
function payOnDayLines(addOns: EnquiryFields["payOnDayAddOns"]): string[] {
  if (!addOns.length) return [];
  return [
    `Paid on the day: ${addOns
      .map((a) => `${a.name} (${a.price > 0 ? `~${money(a.price)} pp` : "price varies"})`)
      .join(", ")}`,
    `  Paid direct to the provider on the day, not included in the estimate.`,
  ];
}

/**
 * Notifies the business (Jimmy) that a new enquiry arrived. Moved from the
 * enquiries route; unchanged except for the added preferred-date line.
 */
export async function sendEnquiryNotification(
  data: EnquiryFields,
  id: string,
): Promise<void> {
  const cfg = await getResend();
  const to = businessRecipients();
  if (!cfg || !to.length) return;

  try {
    const { error } = await cfg.resend.emails.send({
      from: cfg.from,
      to,
      replyTo: data.email,
      subject: `New tour enquiry: ${data.tourName} (${data.name})`,
      text: [
        `New enquiry #${id}`,
        ``,
        `Tour: ${data.tourName}`,
        `Preferred date: ${prettyDate(data.preferredDate)}`,
        ...regionLine(data.region),
        `Guests: ${data.guests}`,
        `Add-ons: ${addOnsLine(data.addOns)}`,
        `Estimated total: ${money(data.total)}`,
        ...payOnDayLines(data.payOnDayAddOns),
        ``,
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone || "Not provided"}`,
        ``,
        `Message:`,
        data.message || "No message provided",
      ].join("\n"),
    });
    if (error) throw error;
  } catch (err) {
    console.error("Enquiry notification failed (enquiry still saved):", err);
  }
}

/** Immediate "we've got your enquiry" acknowledgement to the guest. */
export async function sendEnquiryAck(data: EnquiryFields): Promise<void> {
  const cfg = await getResend();
  if (!cfg) return;

  try {
    const { error } = await cfg.resend.emails.send({
      from: cfg.from,
      to: data.email,
      subject: `We've got your enquiry: ${data.tourName}`,
      text: [
        `Hi ${data.name},`,
        ``,
        `Thanks for your enquiry with Gourmet Getaway Tours! Here's what we have:`,
        ``,
        `Tour: ${data.tourName}`,
        `Preferred date: ${prettyDate(data.preferredDate)}`,
        ...regionLine(data.region),
        `Guests: ${guestsLabel(data.guests)}`,
        `Add-ons: ${addOnsLine(data.addOns)}`,
        `Estimated total: ${money(data.total)}`,
        ...payOnDayLines(data.payOnDayAddOns),
        ``,
        `Jimmy will be in touch shortly to lock in the details and confirm your`,
        `booking. Nothing is booked just yet, this is only to say we've received`,
        `your enquiry.`,
        ``,
        `Talk soon,`,
        `Gourmet Getaway Tours`,
      ].join("\n"),
    });
    if (error) throw error;
  } catch (err) {
    console.error("Enquiry acknowledgement failed (enquiry still saved):", err);
  }
}

/**
 * Sends the booking confirmation to the guest (with an .ics attachment and an
 * "add to Google Calendar" link) and a heads-up to Jimmy. Returns true only if
 * the guest email went out, so the caller can stamp confirmationSentAt.
 */
export async function sendConfirmation(booking: BookingFields): Promise<boolean> {
  const cfg = await getResend();
  if (!cfg) return false;

  const ics = buildIcs(booking);
  const gcal = googleCalendarUrl(booking);
  const dateLabel = prettyDate(booking.tourDate);

  let guestSent = false;
  try {
    const { error } = await cfg.resend.emails.send({
      from: cfg.from,
      to: booking.email,
      subject: `You're booked! ${booking.tourName} (${dateLabel})`,
      text: [
        `Hi ${booking.name},`,
        ``,
        `Great news, your Gourmet Getaway is confirmed!`,
        ``,
        `Tour: ${booking.tourName}`,
        `Date: ${dateLabel}`,
        `Guests: ${guestsLabel(booking.guests)}`,
        `Add-ons: ${addOnsLine(booking.addOns)}`,
        `Total: ${money(booking.total)}`,
        ...payOnDayLines(booking.payOnDayAddOns),
        ``,
        `Add it to your calendar:`,
        `- The attached invite (booking.ics) works with Apple Calendar & Outlook.`,
        `- Google Calendar: ${gcal}`,
        ``,
        `Jimmy will follow up with pickup time and final details before the day.`,
        ``,
        `See you soon,`,
        `Gourmet Getaway Tours`,
      ].join("\n"),
      attachments: [
        {
          filename: "booking.ics",
          content: Buffer.from(ics).toString("base64"),
          contentType: "text/calendar",
        },
      ],
    });
    if (error) throw error;
    guestSent = true;
  } catch (err) {
    console.error("Guest confirmation email failed:", err);
  }

  const to = businessRecipients();
  if (to.length) {
    try {
      const { error } = await cfg.resend.emails.send({
        from: cfg.from,
        to,
        replyTo: booking.email,
        subject: `Booking confirmed: ${booking.tourName} for ${booking.name} (${dateLabel})`,
        text: [
          `Booking #${booking.id} confirmed.`,
          ``,
          `Tour: ${booking.tourName}`,
          `Date: ${dateLabel}`,
          `Guests: ${guestsLabel(booking.guests)}`,
          `Add-ons: ${addOnsLine(booking.addOns)}`,
          `Total: ${money(booking.total)}`,
          ``,
          `Guest: ${booking.name}`,
          `Email: ${booking.email}`,
          `Phone: ${booking.phone || "Not provided"}`,
        ].join("\n"),
      });
      if (error) throw error;
    } catch (err) {
      console.error("Jimmy confirmation email failed:", err);
    }
  }

  return guestSent;
}
