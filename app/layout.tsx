import type { Metadata } from "next";
import Script from "next/script";
import { IBM_Plex_Mono, Quicksand, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookBar from "@/components/BookBar";
import DirectBookingModal from "@/components/DirectBookingModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import VisitorBeacon from "@/components/VisitorBeacon";
import CurrencyProvider from "@/components/CurrencyProvider";
import { SITE_URL, SITE_NAME, HOME_DESCRIPTION, organizationJsonLd } from "@/lib/seo";
import { FAREHARBOR_ENABLED } from "@/lib/fareharbor";
import { detectCountry } from "@/lib/geo.server";
import { themeInitScript } from "@/lib/theme";

// Kept loaded: app/admin/admin.css and app/admin/login/page.tsx still read
// `--font-mono` (see the admin-legacy section of globals.css).
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

// Matches the old site's actual headline/body font pairing
// (gourmetgetawaytours.com.au sets --font-headline-name: 'Quicksand' /
// --font-body-name: 'Poppins' inline — not the theme's generic fallback
// names, which is a different, similar-sounding pair).
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

/*
  Brand name first, then the phrase the page is trying to win — the pattern the
  client's existing site already ranks with, and the same pairing as the home
  page's H1/H2. This is the site-wide default; other pages set their own
  titles through the template below.
*/
const TITLE =
  "Gourmet Getaway Tours | Hunter Valley Food and Wine Tour in NSW";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: HOME_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: TITLE,
    description: HOME_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: HOME_DESCRIPTION,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // A header read, not a network call: costs nothing on any route. Currency
  // rates themselves are fetched client-side so nothing here can delay a price.
  const country = await detectCountry();

  return (
    <html lang="en-AU" suppressHydrationWarning>
      <body
        className={`${plexMono.variable} ${quicksand.variable} ${poppins.variable}`}
        style={
          {
            "--font": "var(--font-poppins), system-ui, sans-serif",
            "--font-display": "var(--font-quicksand), Arial, sans-serif",
          } as React.CSSProperties
        }
      >
        {/* Sets <html data-theme> from localStorage/system preference before
            first paint, so there's no flash of the wrong theme. Must run
            before Header (or anything else) renders. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript() }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()),
          }}
        />
        <CurrencyProvider initialCountry={country}>
          <Header />
          {children}
          <Footer />
          <BookBar />
          <DirectBookingModal />
          <WhatsAppButton />
        </CurrencyProvider>
        <VisitorBeacon />

        {/*
          FareHarbor embed API. `autolightframe=yes` makes it intercept clicks
          on any fareharbor.com/embeds/book/… link on the page and open it in a
          modal, which is how every booking CTA here works.
        */}
        {FAREHARBOR_ENABLED && (
          <Script
            src="https://fareharbor.com/embeds/api/v1/?autolightframe=yes"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
