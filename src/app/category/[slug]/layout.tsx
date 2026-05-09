import type { Metadata } from 'next';
import { getCategories } from '@/lib/firestore';

interface Props {
  params: Promise<{ slug: string }>;
}

function toOgImage(url: string): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/c_fill,w_1200,h_630,q_80,f_jpg/');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const categories = await getCategories();
    const category = categories.find((c) => c.slug === slug);

    if (!category) {
      return { title: 'Category' };
    }

    const title = `${category.name} Stories — Conscious Travel | Travel Handmade`;
    const description = category.description || `Explore ${category.name} stories from Travel Handmade.`;
    const image = category.featuredImage
      ? toOgImage(category.featuredImage)
      : '/og-default.png';

    return {
      title: category.name,
      description,
      alternates: {
        canonical: `https://www.travelhandmade.com/category/${slug}`,
      },
      openGraph: {
        title,
        description,
        images: [{ url: image, width: 1200, height: 630, alt: category.name }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
    };
  } catch {
    return { title: 'Category' };
  }
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
