import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Departures Newsletter',
  description:
    'Departures — a monthly Travel Handmade newsletter with curated journeys, editor\'s letters, and long reads that trace narratives from the road less travelled.',
  alternates: {
    canonical: 'https://www.travelhandmade.com/newsletter',
  },
  openGraph: {
    title: 'Departures Newsletter | Travel Handmade',
    description:
      'A monthly curation of travel perspectives, exclusive insights, and long reads. This is travel that begins where the guidebooks end.',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Departures Newsletter by Travel Handmade' }],
  },
};

export default function NewsletterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
