import type { Post, Testimonial, Traveller } from '@/types';
import type { SiteSettings } from './settings';

async function getAdminDb() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) return null;

  try {
    const { adminDb } = await import('./firebase-admin');
    return adminDb;
  } catch {
    return null;
  }
}

function toIso(ts: unknown): string {
  if (!ts) return '';
  if (typeof ts === 'string') return ts;
  if (
    typeof ts === 'object' &&
    ts !== null &&
    'toDate' in ts &&
    typeof (ts as { toDate: unknown }).toDate === 'function'
  ) {
    return (ts as { toDate: () => Date }).toDate().toISOString();
  }
  return '';
}

export async function getPublishedPostsServer(): Promise<Post[]> {
  try {
    const db = await getAdminDb();
    if (!db) return [];

    const snapshot = await db
      .collection('posts')
      .where('status', '==', 'published')
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: toIso(data.createdAt),
        updatedAt: toIso(data.updatedAt),
        publishedAt: data.publishedAt ? toIso(data.publishedAt) : undefined,
      } as Post;
    });
  } catch (error) {
    console.error('Server: Error fetching published posts:', error);
    return [];
  }
}

export async function getTestimonialsServer(): Promise<Testimonial[]> {
  try {
    const db = await getAdminDb();
    if (!db) return [];

    const snapshot = await db
      .collection('testimonials')
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Testimonial[];
  } catch (error) {
    console.error('Server: Error fetching testimonials:', error);
    return [];
  }
}

export async function getTravellersServer(): Promise<Traveller[]> {
  try {
    const db = await getAdminDb();
    if (!db) return [];

    const snapshot = await db
      .collection('travellers')
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Traveller[];
  } catch (error) {
    console.error('Server: Error fetching travellers:', error);
    return [];
  }
}

export async function getPostBySlugServer(slug: string): Promise<Post | null> {
  try {
    const db = await getAdminDb();
    if (!db) return null;

    const snapshot = await db
      .collection('posts')
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: toIso(data.createdAt),
      updatedAt: toIso(data.updatedAt),
      publishedAt: data.publishedAt ? toIso(data.publishedAt) : undefined,
    } as Post;
  } catch (error) {
    console.error('Server: Error fetching post by slug:', error);
    return null;
  }
}

export async function getCategoryBySlugServer(slug: string): Promise<{ name: string; description?: string; featuredImage?: string } | null> {
  try {
    const db = await getAdminDb();
    if (!db) return null;

    const snapshot = await db
      .collection('categories')
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const data = snapshot.docs[0].data();
    return {
      name: data.name,
      description: data.description,
      featuredImage: data.featuredImage,
    };
  } catch (error) {
    console.error('Server: Error fetching category by slug:', error);
    return null;
  }
}

export async function getSiteSettingsServer(): Promise<SiteSettings | null> {
  try {
    const db = await getAdminDb();
    if (!db) return null;

    const docSnap = await db.collection('settings').doc('general').get();
    if (docSnap.exists) {
      return docSnap.data() as SiteSettings;
    }
    return null;
  } catch (error) {
    console.error('Server: Error fetching site settings:', error);
    return null;
  }
}
