import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.travelhandmade.com';

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/about-us`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact-us`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/newsletter`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    // Static category pages — always included even if Admin SDK is unavailable
    { url: `${BASE_URL}/category/travel-living`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/category/adventure-wildlife`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/category/food-drinks`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/category/retreats`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/category/wellness`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/category/changemaker`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/category/traveller`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];

  let blogPages: MetadataRoute.Sitemap = [];
  let categoryPages: MetadataRoute.Sitemap = [];
  let newsletterPages: MetadataRoute.Sitemap = [];

  try {
    const db = await getAdminDb();
    if (db) {
      // Blog posts
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
            lastModified: data.updatedAt?.toDate?.() ?? new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
          };
        });

      // Categories from Firestore (supplements the static list above)
      const categoriesSnap = await db.collection('categories').get();
      const dynamicCategorySlugs = new Set(
        staticPages.map((p) => p.url).filter((u) => u.includes('/category/'))
      );
      categoryPages = categoriesSnap.docs
        .filter((doc) => {
          const slug = doc.data().slug;
          return slug && !dynamicCategorySlugs.has(`${BASE_URL}/category/${slug}`);
        })
        .map((doc) => ({
          url: `${BASE_URL}/category/${doc.data().slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));

      // Newsletter issues
      const newslettersSnap = await db
        .collection('newsletters')
        .where('status', '==', 'published')
        .get();

      newsletterPages = newslettersSnap.docs
        .filter((doc) => doc.data().slug)
        .map((doc) => ({
          url: `${BASE_URL}/newsletter/${doc.data().slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }));
    }
  } catch (err) {
    console.error('Sitemap: error fetching dynamic pages', err);
  }

  return [...staticPages, ...blogPages, ...categoryPages, ...newsletterPages];
}
