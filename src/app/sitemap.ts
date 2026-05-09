import type { MetadataRoute } from 'next';
import { getAllPostsTyped, getCategories, getNewsletters } from '@/lib/firestore';

const BASE_URL = 'https://www.travelhandmade.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/newsletter`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Blog posts
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await getAllPostsTyped();
    blogPages = posts
      .filter((p) => p.status === 'published' && p.slug)
      .map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }));
  } catch {
    // fail silently — sitemap still serves static pages
  }

  // Category pages
  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const categories = await getCategories();
    categoryPages = categories.map((cat) => ({
      url: `${BASE_URL}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch {
    // fail silently
  }

  // Newsletter issues
  let newsletterPages: MetadataRoute.Sitemap = [];
  try {
    const newsletters = await getNewsletters();
    newsletterPages = newsletters.map((issue) => ({
      url: `${BASE_URL}/newsletter/${issue.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch {
    // fail silently
  }

  return [...staticPages, ...blogPages, ...categoryPages, ...newsletterPages];
}
