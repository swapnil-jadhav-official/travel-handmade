import type { Metadata } from 'next';
import { getPostBySlugServer } from '@/lib/firestore-server';
import BlogPostContent from './BlogPostContent';

const DEFAULT_OG_IMAGE = 'https://res.cloudinary.com/dzrabrzd4/image/upload/v1778396717/k5bn4hhzofln8atagn6r.png';

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlugServer(slug);

  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt || undefined,
      images: [{ url: post.featuredImage || DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.publishedAt || undefined,
      authors: post.authorName ? [post.authorName] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || undefined,
      images: [post.featuredImage || DEFAULT_OG_IMAGE],
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  return <BlogPostContent slug={slug} />;
}
