import { HomeContent } from '@/components/HomeContent';
import {
  getPublishedPostsServer,
  getTestimonialsServer,
  getTravellersServer,
  getSiteSettingsServer,
} from '@/lib/firestore-server';

export default async function Home() {
  const [posts, testimonials, travellers, settings] = await Promise.all([
    getPublishedPostsServer(),
    getTestimonialsServer(),
    getTravellersServer(),
    getSiteSettingsServer(),
  ]);

  // Sort by publishedAt first, fall back to createdAt — matches previous client-side sort
  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = a.publishedAt || a.createdAt;
    const dateB = b.publishedAt || b.createdAt;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  return (
    <HomeContent
      posts={sortedPosts}
      testimonials={testimonials}
      travellers={travellers}
      settings={settings}
    />
  );
}
