import type { Metadata } from 'next';
import { getCategories } from '@/lib/firestore';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const categories = await getCategories();
    const category = categories.find((c) => c.slug === slug);

    if (!category) {
      return { title: 'Category' };
    }

    return {
      title: category.name,
      description: `Explore Travel Handmade stories in ${category.name} — conscious travel, cultural journalism, and immersive storytelling.`,
      alternates: {
        canonical: `https://www.travelhandmade.com/category/${slug}`,
      },
      openGraph: {
        title: `${category.name} | Travel Handmade`,
        description: `Explore stories in ${category.name} from Travel Handmade.`,
        images: category.featuredImage
          ? [{ url: category.featuredImage, width: 1200, height: 630, alt: category.name }]
          : [{ url: '/th-logo-new.png', width: 1200, height: 630, alt: category.name }],
      },
    };
  } catch {
    return { title: 'Category' };
  }
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
