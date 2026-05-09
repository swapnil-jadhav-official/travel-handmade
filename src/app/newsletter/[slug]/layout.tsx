import type { Metadata } from 'next';
import { getNewsletterBySlug } from '@/lib/firestore';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const issue = await getNewsletterBySlug(slug);

  if (!issue) {
    return {
      title: 'Newsletter Not Found',
      robots: { index: false, follow: false },
    };
  }

  const title = `Departures — Issue ${String(issue.issueNumber).padStart(2, '0')}: ${issue.title}`;

  return {
    title: `Departures Issue ${String(issue.issueNumber).padStart(2, '0')}: ${issue.title}`,
    description: issue.description,
    openGraph: {
      type: 'article',
      title,
      description: issue.description,
      images: issue.heroImage
        ? [{ url: issue.heroImage, width: 1200, height: 630, alt: title }]
        : [{ url: '/og-default.jpg', width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: issue.description,
      images: issue.heroImage ? [issue.heroImage] : ['/og-default.jpg'],
    },
  };
}

export default function NewsletterSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
