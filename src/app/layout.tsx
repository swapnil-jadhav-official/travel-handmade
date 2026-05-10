import type { Metadata } from "next";
import { Geist, Geist_Mono, Unbounded, Roboto_Flex, Work_Sans, Dancing_Script } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import JsonLd from "@/components/JsonLd";
import { RootProvider } from "@/components/RootProvider";
import { getSiteSettings } from "@/lib/settings";
import "./globals.css";

// ── Replace with your GA4 Measurement ID once available (format: G-XXXXXXXXXX) ──
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
});

const robotoFlex = Roboto_Flex({
  variable: "--font-roboto-flex",
  subsets: ["latin"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
});

const floresttaOpheralio = localFont({
  src: "../../public/fonnts.com-482677/fonts/fonnts.com-FloresttaOpheralio-vm1K4.otf",
  variable: "--font-florestta",
  display: "swap",
});

const DEFAULT_SITE_TITLE = 'Travel Handmade';
const DEFAULT_SITE_DESCRIPTION =
  'A digital publication for conscious travellers. Discover cultural storytelling, immersive photography, and long-form travel journalism that begins where the guidebooks end.';
const DEFAULT_OG_TITLE = 'Travel Handmade — Conscious Travel & Cultural Storytelling';
const DEFAULT_OG_DESCRIPTION =
  'A digital publication for conscious travellers. Discover cultural storytelling, immersive photography, and long-form travel journalism.';

export async function generateMetadata(): Promise<Metadata> {
  let settings = null;
  try {
    settings = await getSiteSettings();
  } catch {
    // fall back to defaults if Firestore is unreachable
  }

  const siteTitle = settings?.siteName || DEFAULT_SITE_TITLE;
  const siteDescription = settings?.siteDescription || DEFAULT_SITE_DESCRIPTION;
  const ogTitle = settings?.ogTitle || DEFAULT_OG_TITLE;
  const ogDescription = settings?.ogDescription || DEFAULT_OG_DESCRIPTION;
  const ogImage = settings?.ogImageUrl || '/og-default.png';

  return {
    metadataBase: new URL('https://www.travelhandmade.com'),
    title: {
      default: siteTitle,
      template: `%s | ${siteTitle}`,
    },
    description: siteDescription,
    keywords: ['travel', 'conscious travel', 'cultural travel', 'travel journalism', 'travel magazine', 'India travel', 'travel stories'],
    authors: [{ name: 'Travel Handmade Editorial Team' }],
    openGraph: {
      type: 'website',
      siteName: siteTitle,
      title: ogTitle,
      description: ogDescription,
      images: [{ url: ogImage, width: 1200, height: 630, alt: siteTitle }],
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    alternates: {
      canonical: 'https://www.travelhandmade.com',
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${unbounded.variable} ${robotoFlex.variable} ${workSans.variable} ${dancingScript.variable} ${floresttaOpheralio.variable} antialiased`}
      >
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}
        <JsonLd data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Organization',
              '@id': 'https://www.travelhandmade.com/#organization',
              name: 'Travel Handmade',
              url: 'https://www.travelhandmade.com',
              logo: {
                '@type': 'ImageObject',
                url: 'https://www.travelhandmade.com/th-logo-new.png',
              },
              sameAs: ['https://www.instagram.com/travelhandmade_mag/'],
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'editor@travelhandmade.com',
                contactType: 'editorial',
              },
            },
            {
              '@type': 'WebSite',
              '@id': 'https://www.travelhandmade.com/#website',
              url: 'https://www.travelhandmade.com',
              name: 'Travel Handmade',
              description: 'A digital publication for conscious travellers — cultural storytelling and long-form travel journalism.',
              publisher: { '@id': 'https://www.travelhandmade.com/#organization' },
              potentialAction: {
                '@type': 'SearchAction',
                target: { '@type': 'EntryPoint', urlTemplate: 'https://www.travelhandmade.com/?s={search_term_string}' },
                'query-input': 'required name=search_term_string',
              },
            },
          ],
        }} />
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
