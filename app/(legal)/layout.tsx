import CurrencyProvider from "@/components/CurrencyProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NatureBackdrop from "@/components/NatureBackdrop";

/**
 * Shell for the policy pages. Same header and footer as the home page, and
 * now the same fixed nature backdrop + frosted-glass treatment as the rest of
 * the site (see .nature-page in globals.css) rather than the plain cream
 * background these pages used to keep. Header stays outside `.nature-page`,
 * same as on the home page, so its own glass bar isn't re-skinned by the
 * blanket heading/button rules meant for content sitting over the photo.
 */
export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CurrencyProvider>
      <NatureBackdrop />
      {/* legal-shell keeps the footer on the bottom edge — these pages are
          short enough to leave a band of paper under it otherwise. */}
      <div className="legal-shell">
        <Header />
        {/* Flex column in its own right (see .legal-glass-wrap), so `.legal`'s
            existing flex:1 still pushes the footer to the bottom edge once
            main and footer are nested a level deeper than before. */}
        <div className="nature-page legal-glass-wrap">
          <main className="legal">
            <div className="wrap legal-inner">{children}</div>
          </main>
          <Footer />
        </div>
      </div>
    </CurrencyProvider>
  );
}
