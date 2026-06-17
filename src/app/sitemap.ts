import type { MetadataRoute } from 'next';
import { getAllPostsTyped, getCategories, getNewsletters } from '@/lib/firestore';

const BASE_URL = 'https://www.travelhandmade.com';

export const revalidate = 3600;

async function getAdminDb() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) return null;

  try {
    const { adminDb } = await import('@/lib/firebase-admin');
    return adminDb;
  } catch {
    return null;
  }
}

function toDate(value: unknown, fallback: Date): Date {
  if (!value) return fallback;
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? fallback : parsed;
  }
  if (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as { toDate: unknown }).toDate === 'function'
  ) {
    return (value as { toDate: () => Date }).toDate();
  }
  return fallback;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/about-us`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact-us`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/newsletter`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/category/travel-living`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/category/adventure-wildlife`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/category/food-drinks`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/category/retreats`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/category/wellness`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/category/changemaker`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/category/traveller`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ];

  const staticCategoryUrls = new Set(
    staticPages.map((page) => page.url).filter((url) => url.includes('/category/'))
  );

  let blogPages: MetadataRoute.Sitemap = [];
  let categoryPages: MetadataRoute.Sitemap = [];
  let newsletterPages: MetadataRoute.Sitemap = [];

  try {
    const db = await getAdminDb();

    if (db) {
      const postsSnap = await db
        .collection('posts')
        .where('status', '==', 'published')
        .get();

      blogPages = postsSnap.docs
        .filter((doc) => doc.data().slug)
        .map((doc) => {
          const data = doc.data();
          return {
            url: `${BASE_URL}/blog/${data.slug}`,
            lastModified: toDate(data.updatedAt, now),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
          };
        });

      const categoriesSnap = await db.collection('categories').get();
      categoryPages = categoriesSnap.docs
        .filter((doc) => {
          const slug = doc.data().slug;
          return slug && !staticCategoryUrls.has(`${BASE_URL}/category/${slug}`);
        })
        .map((doc) => ({
          url: `${BASE_URL}/category/${doc.data().slug}`,
          lastModified: now,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));

      const newslettersSnap = await db
        .collection('newsletters')
        .where('status', '==', 'published')
        .get();

      newsletterPages = newslettersSnap.docs
        .filter((doc) => doc.data().slug)
        .map((doc) => ({
          url: `${BASE_URL}/newsletter/${doc.data().slug}`,
          lastModified: now,
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }));
    }
  } catch (err) {
    console.error('Sitemap: error fetching dynamic pages with Admin SDK', err);
  }

  if (blogPages.length === 0) {
    try {
      const posts = await getAllPostsTyped();
      blogPages = posts
        .filter((post) => post.status === 'published' && post.slug)
        .map((post) => ({
          url: `${BASE_URL}/blog/${post.slug}`,
          lastModified: toDate(post.updatedAt, now),
          changeFrequency: 'weekly' as const,
          priority: 0.9,
        }));
    } catch (err) {
      console.error('Sitemap: error fetching blog pages with public Firestore fallback', err);
    }
  }

  if (categoryPages.length === 0) {
    try {
      const categories = await getCategories();
      categoryPages = categories
        .filter((category) => category.slug && !staticCategoryUrls.has(`${BASE_URL}/category/${category.slug}`))
        .map((category) => ({
          url: `${BASE_URL}/category/${category.slug}`,
          lastModified: now,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));
    } catch (err) {
      console.error('Sitemap: error fetching category pages with public Firestore fallback', err);
    }
  }

  if (newsletterPages.length === 0) {
    try {
      const newsletters = await getNewsletters();
      newsletterPages = newsletters
        .filter((issue) => {
          const status = (issue as { status?: string }).status;
          return issue.slug && (!status || status === 'published');
        })
        .map((issue) => ({
          url: `${BASE_URL}/newsletter/${issue.slug}`,
          lastModified: now,
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }));
    } catch (err) {
      console.error('Sitemap: error fetching newsletter pages with public Firestore fallback', err);
    }
  }

  return [...staticPages, ...blogPages, ...categoryPages, ...newsletterPages];
}
