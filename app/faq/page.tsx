import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Everything you might want to know before the day — pickups, group sizes, dietary needs and how direct booking works.",
  alternates: { canonical: "/faq" },
};

const FAQS = [
  { q: "Can you cater for dietary requirements?", a: "Yes. As fellow food and wine lovers, we'll do our utmost to accommodate special diets — vegetarian, vegan, gluten-free and allergies. Just let us know when you book so your chef can plan the menu around you." },
  { q: "Where do you pick up from?", a: "Door-to-door from selected Sydney hotels, roughly between 6:35 and 7:10am. Tell us where you're staying and we'll confirm your pickup time." },
  { q: "What time do we get back?", a: "We aim to have you back in Sydney around 6:30pm. It's a full day — up to 11 hours door to door." },
  { q: "How big are the groups?", a: "Always small — between 2 and 16 guests, never a coach. That's the whole point: a personal day with your chef and guide." },
  { q: "Can children come along?", a: "Absolutely — the tour is family friendly for ages 4 and up. We can't accommodate infants aged 0–3, and under-18s can't be served alcohol under Australian licensing laws." },
  { q: "What's included in the price?", a: "Pickup and drop-off, a progressive breakfast and lunch cooked by your chef/guide, three wine tastings matched to the menu, and comfortable air-conditioned transport all day." },
  { q: "How do I save by booking direct?", a: "Book direct and select \"Student of wine\" at checkout to take $20 off the adult price — with no booking fees, and it goes straight to Jimmy rather than a booking platform." },
  { q: "Do you run private tours?", a: "Yes — destinations north, east, west and south of Sydney for just your group, from 2 to 16 guests. Head to the Private Tours page or send an enquiry and we'll craft the day around you." },
];

export default function FaqPage() {
  return (
    <>
      <section
        className="page-hero"
        style={{ background: "linear-gradient(135deg,#4A5D3A,#6E1E2E)" }}
      >
        <div className="wrap">
          <span className="eyebrow">Good to know</span>
          <h1>Frequently Asked Questions</h1>
          <p>
            Everything you might want to know before the day — and if
            it&apos;s not here, just ask.
          </p>
        </div>
      </section>

      <section className="pad">
        <div className="wrap">
          <FaqAccordion items={FAQS} />
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <h2>Still have a question?</h2>
          <p>Send us a note — Jimmy&apos;s happy to help.</p>
          <Link href="/contact" className="btn btn-gold">
            Contact us
          </Link>
        </div>
      </section>
    </>
  );
}
