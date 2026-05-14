import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read the Travel Handmade privacy policy — how we collect, use, and protect your data.',
  alternates: {
    canonical: 'https://www.travelhandmade.com/privacy',
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
