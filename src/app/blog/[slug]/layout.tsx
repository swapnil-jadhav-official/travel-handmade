import type { Metadata } from 'next';
import { getPostBySlug } from '@/lib/firestore';
import JsonLd from '@/components/JsonLd';

const BASE_URL = 'https://www.travelhandmade.com';

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

// Resize Cloudinary images to 1200×630 for OG tags (keeps under 600 KB)
function toOgImage(url: string): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/c_fill,w_1200,h_630,q_80,f_jpg/');
}

// Truncate description to optimal OG length
function toOgDescription(text: string, max = 155): string {
  if (!text) return '';
  return text.length <= max ? text : text.slice(0, max - 1).trimEnd() + '…';
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
    description: toOgDescription(post.excerpt || post.title),
    alternates: {
      canonical: `${BASE_URL}/blog/${slug}`,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: toOgDescription(post.excerpt || post.title),
      images: post.featuredImage
        ? [{ url: toOgImage(post.featuredImage), width: 1200, height: 630, alt: post.title }]
        : [{ url: '/og-default.jpg', width: 1200, height: 630, alt: post.title }],
      publishedTime: post.publishedAt,
      authors: [post.authorName || post.author || 'Travel Handmade'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: toOgDescription(post.excerpt || post.title),
      images: post.featuredImage ? [toOgImage(post.featuredImage)] : ['/og-default.jpg'],
    },
  };
}

export default async function BlogSlugLayout({ params, children }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return <>{children}</>;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.featuredImage ? toOgImage(post.featuredImage) : `${BASE_URL}/og-default.jpg`,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt || post.createdAt,
    author: {
      '@type': 'Person',
      name: post.authorName || post.author || 'Travel Handmade',
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'Travel Handmade',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/th-logo-new.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/blog/${slug}` },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: post.category || 'Articles', item: `${BASE_URL}/category/${post.category}` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${BASE_URL}/blog/${slug}` },
    ],
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  );
}
