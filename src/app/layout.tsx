import type { Metadata } from "next";
import { Geist, Geist_Mono, Unbounded, Roboto_Flex, Work_Sans, Dancing_Script } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { RootProvider } from "@/components/RootProvider";
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

export const metadata: Metadata = {
  metadataBase: new URL('https://www.travelhandmade.com'),
  title: {
    default: 'Travel Handmade',
    template: '%s | Travel Handmade',
  },
  description:
    'A digital publication for conscious travellers. Discover cultural storytelling, immersive photography, and long-form travel journalism that begins where the guidebooks end.',
  keywords: ['travel', 'conscious travel', 'cultural travel', 'travel journalism', 'travel magazine', 'India travel', 'travel stories'],
  authors: [{ name: 'Travel Handmade Editorial Team' }],
  openGraph: {
    type: 'website',
    siteName: 'Travel Handmade',
    title: 'Travel Handmade',
    description:
      'A digital publication for conscious travellers. Discover cultural storytelling, immersive photography, and long-form travel journalism.',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Travel Handmade' }],
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travel Handmade',
    description:
      'A digital publication for conscious travellers. Cultural storytelling and long-form travel journalism.',
    images: ['/og-default.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

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
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
