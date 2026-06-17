import type { Metadata } from 'next';
import { getCategoryBySlugServer, getPostsByCategoryServer } from '@/lib/firestore-server';
import CategoryPageContent from './CategoryPageContent';

const DEFAULT_OG_IMAGE = 'https://res.cloudinary.com/dzrabrzd4/image/upload/v1778396717/k5bn4hhzofln8atagn6r.png';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlugServer(slug);

  const name = category?.name ?? slug.replace(/-/g, ' + ').replace(/\b\w/g, (c) => c.toUpperCase());
  const description = category?.description ?? `Explore ${name} stories on Travel Handmade.`;
  const image = category?.featuredImage ?? DEFAULT_OG_IMAGE;

  return {
    title: name,
    description,
    openGraph: {
      type: 'website',
      title: `${name} | Travel Handmade`,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} | Travel Handmade`,
      description,
      images: [image],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [category, posts] = await Promise.all([
    getCategoryBySlugServer(slug),
    getPostsByCategoryServer(slug),
  ]);

  return <CategoryPageContent slug={slug} initialCategory={category} initialPosts={posts} />;
}
