import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import {
  BUSINESS_ADDRESS,
  BUSINESS_EMAIL,
  BUSINESS_PHONE,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Questions, private-tour enquiries or dietary needs — send a note and Jimmy will get back to you.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section
        className="page-hero"
        style={{ backgroundImage: "url(/images/Hunter-Valley-Tour-image-4.jpg)" }}
      >
        <div className="wrap">
          <span className="eyebrow">We&apos;d love to hear from you</span>
          <h1>Contact Us</h1>
          <p>
            Questions, private-tour enquiries or dietary needs — send a note
            and Jimmy will get back to you.
          </p>
        </div>
      </section>

      <section className="pad">
        <div className="wrap contact-grid">
          <div>
            <span className="eyebrow">Get in touch</span>
            <h2 style={{ fontSize: "1.9rem", margin: ".3em 0 .8em" }}>Reach us directly</h2>
            <div className="contact-item">
              <div className="ci-ic">☎</div>
              <div>
                <b>Phone</b>
                <br />
                <a href={`tel:${BUSINESS_PHONE}`}>0416 139 567</a>
              </div>
            </div>
            <div className="contact-item">
              <div className="ci-ic">✉</div>
              <div>
                <b>Email</b>
                <br />
                <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a>
              </div>
            </div>
            <div className="contact-item">
              <div className="ci-ic">📍</div>
              <div>
                <b>Base</b>
                <br />
                {BUSINESS_ADDRESS.street}, {BUSINESS_ADDRESS.suburb}{" "}
                {BUSINESS_ADDRESS.stateCode} {BUSINESS_ADDRESS.postcode}
              </div>
            </div>
            <div className="contact-item">
              <div className="ci-ic">🕑</div>
              <div>
                <b>Tours run</b>
                <br />
                Hunter Valley: Monday &amp; Wednesday · Private: most days
              </div>
            </div>
            <div className="contact-map">
              <span>Pickup area &amp; base</span>
            </div>
          </div>
          <div className="contact-form">
            <h3 style={{ fontSize: "1.3rem", marginBottom: 6 }}>Send an enquiry</h3>
            <p style={{ color: "var(--ink-soft)", fontSize: ".9rem", marginBottom: 20 }}>
              No booking fees — enquire direct and save.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
