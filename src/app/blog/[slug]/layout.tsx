import type { Metadata } from 'next';
import { getPostBySlug } from '@/lib/firestore';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt || post.title,
      images: post.featuredImage
        ? [{ url: post.featuredImage, width: 1200, height: 630, alt: post.title }]
        : [{ url: '/og-default.jpg', width: 1200, height: 630, alt: post.title }],
      publishedTime: post.publishedAt,
      authors: [post.authorName || post.author || 'Travel Handmade'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.title,
      images: post.featuredImage ? [post.featuredImage] : ['/og-default.jpg'],
    },
  };
}

export default function BlogSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
