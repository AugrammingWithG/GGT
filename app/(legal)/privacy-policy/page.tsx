import type { Metadata } from "next";
import Link from "next/link";
import {
  BUSINESS_ADDRESS,
  BUSINESS_EMAIL,
  BUSINESS_PHONE,
  SITE_NAME,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy policy (draft)",
  description: `How ${SITE_NAME} collects, stores and uses enquiry details.`,
  // Not indexed and not yet linked from anywhere on the site — this page is
  // a draft awaiting client sign-off, not a published policy.
  robots: { index: false, follow: false },
};

/*
  DRAFT. Generated from a direct read of the enquiry flow's code (form ->
  /api/enquiries -> Firestore -> Resend emails -> optional FareHarbor handoff
  -> /admin dashboard) as it exists today, not a generic template. It has NOT
  been reviewed by the client or a lawyer and must not go live, be linked from
  the site nav, or be submitted anywhere until they've approved it. If the
  underlying code changes (new integration, new field collected, a retention
  job added), this page will be out of date until someone updates it to match.
*/
export default function PrivacyPolicy() {
  return (
    <>
      <div className="draft-banner">
        <strong>DRAFT. Not approved, not live.</strong> This describes what
        the site's enquiry form actually does today. It has not been reviewed
        by {SITE_NAME} or a lawyer. Do not link this page from the site or
        treat it as binding until it's been approved.
      </div>

      <p className="eyebrow">Legal</p>
      <h1 className="legal-title">Privacy policy</h1>

      <div className="legal-prose">
        <p>
          This policy covers the enquiry form on this website, the only
          place {SITE_NAME} collects personal information through the site
          itself. It explains what's collected, why, where it's kept, who can
          see it, how long it's kept, and how to ask for it to be deleted.
        </p>

        <h2>Who we are</h2>
        <p>
          {SITE_NAME}
          <br />
          {BUSINESS_ADDRESS.street}, {BUSINESS_ADDRESS.suburb}{" "}
          {BUSINESS_ADDRESS.stateCode} {BUSINESS_ADDRESS.postcode}, Australia
          <br />
          Email: {BUSINESS_EMAIL}
          <br />
          Phone: {BUSINESS_PHONE}
        </p>

        <h2>What we collect</h2>
        <p>When you submit an enquiry, we collect:</p>
        <ul>
          <li>Your name</li>
          <li>Your email address</li>
          <li>Your phone number, if you choose to give it (optional)</li>
          <li>A preferred tour date, if you choose to give one (optional)</li>
          <li>Any message you type in the "anything else?" field (optional)</li>
          <li>
            The tour, guest count, add-ons and estimated price you selected.
            This isn't personal information on its own, but it's stored and
            emailed alongside your details above
          </li>
        </ul>

        <h2>Why we collect it</h2>
        <p>We use these details to:</p>
        <ul>
          <li>Reply to your enquiry and quote or arrange your tour</li>
          <li>
            Send you an immediate email confirming what you submitted, and
            later, if your booking is confirmed, a booking confirmation with a
            calendar invite
          </li>
          <li>
            Fill in your details automatically if you continue through to the
            booking checkout, so you don't have to retype them
          </li>
        </ul>
        <p>We don't use your details for marketing, and we don't sell it.</p>

        <h2>Where it's stored</h2>
        <p>
          Enquiries are stored in a Google Cloud Firestore database. Direct
          access from a web browser is switched off entirely. The database
          only accepts reads and writes from our own server code, which checks
          who's allowed to see or change anything before it does.
        </p>

        <h2>Who can see it</h2>
        <ul>
          <li>
            <strong>Jimmy / the business inbox.</strong> Every enquiry is
            emailed to our booking inbox as soon as it's submitted, and again
            when a booking is confirmed.
          </li>
          <li>
            <strong>You.</strong> We email you back a copy of what you
            submitted.
          </li>
          <li>
            <strong>Resend</strong>, our email delivery provider. It
            processes every email above on our behalf in order to send it.
          </li>
          <li>
            <strong>Staff with admin access.</strong> A short allow-list of
            staff email addresses can log in to view, update and manage
            enquiries. Login is protected by Firebase Authentication.
          </li>
          <li>
            <strong>FareHarbor</strong>, our booking platform. If you
            continue from an enquiry through to checkout, your name, email,
            phone and message are passed to FareHarbor to pre-fill the
            booking form. This only happens if you proceed to that step.
          </li>
        </ul>
        <p>
          Nobody else. There is no analytics or advertising tracking on this
          site that receives your enquiry details.
        </p>

        <h2>How long we keep it</h2>
        <p>
          <em>
            [Client to confirm: currently there is no automatic deletion.
            Enquiries are kept indefinitely unless a staff member manually
            deletes one. We should agree a retention period here (e.g.
            "for 24 months after your enquiry, or until you ask us to delete
            it") before this goes live.]
          </em>
        </p>

        <h2>Requesting deletion or a copy of your details</h2>
        <p>
          To ask us to delete your details or send you a copy of what we
          hold, email {BUSINESS_EMAIL}. Deletion is currently handled
          manually by a staff member once we receive your request.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          If how we collect or use your details changes, we'll update this
          page.
        </p>

        <p className="legal-more">
          <Link href="/terms-and-conditions">Terms and conditions</Link>
          {" · "}
          <Link href="/cancellation-policy">Cancellation policy</Link>
        </p>
      </div>
    </>
  );
}
