import Header from "@/components/Header";
import HunterHero from "@/components/HunterHero";
import DestinationGallery from "@/components/DestinationGallery";
import Motto from "@/components/Motto";
import TourBuilder from "@/components/TourBuilder";
import JimmyStrip from "@/components/JimmyStrip";
import Testimonials from "@/components/Testimonials";
import SocialCTA from "@/components/SocialCTA";
import Footer from "@/components/Footer";
import NatureBackdrop from "@/components/NatureBackdrop";
import CurrencyProvider from "@/components/CurrencyProvider";
import { getPrivateTourRate, getTours } from "@/lib/tours.server";
import { toursJsonLd } from "@/lib/seo";
import { detectCountry } from "@/lib/geo.server";

// Re-fetch tour data on each request so Firestore edits show up without rebuild.
export const dynamic = "force-dynamic";

export default async function Home() {
  const tours = await getTours();
  const privateTourRate = await getPrivateTourRate();
  // A header read, not a network call: costs nothing, and the page is already
  // dynamic. Rates are fetched client-side so nothing here can delay a price.
  const country = await detectCountry();

  return (
    <>
      {/*
        Structured data stays in AUD regardless of what the visitor sees on the
        page: it describes what the business charges, not what we display.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(toursJsonLd(tours)),
        }}
      />
      <CurrencyProvider initialCountry={country}>
        {/* Fixed nature backdrop for the whole page, echoing the hero photo.
            HunterHero's own photo covers it up top; below the fold it shows
            through the frosted-glass sections (.nature-page). */}
        <NatureBackdrop />
        {/* overlay: the nav floats transparent over the Hunter Valley hero,
            which runs full-bleed from the top of the viewport. */}
        <Header overlay />
        <HunterHero />
        {/* Everything below the hero floats over the backdrop as glass. Scoped
            to this wrapper so the legal and admin pages keep their cream look. */}
        <div className="nature-page">
          <Motto />
          <DestinationGallery />
          <TourBuilder tours={tours} privateTourRate={privateTourRate} />
          <JimmyStrip />
          <Testimonials />
          <SocialCTA />
          <Footer />
        </div>
      </CurrencyProvider>
    </>
  );
}
