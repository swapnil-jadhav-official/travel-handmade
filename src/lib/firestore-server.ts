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

function getPublicFirebaseConfig() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!projectId || !apiKey) return null;
  return { projectId, apiKey };
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

function firestoreValueToJs(value: unknown): unknown {
  if (!value || typeof value !== 'object') return undefined;

  const typedValue = value as Record<string, unknown>;
  if ('stringValue' in typedValue) return typedValue.stringValue;
  if ('integerValue' in typedValue) return Number(typedValue.integerValue);
  if ('doubleValue' in typedValue) return Number(typedValue.doubleValue);
  if ('booleanValue' in typedValue) return typedValue.booleanValue;
  if ('timestampValue' in typedValue) return typedValue.timestampValue;
  if ('nullValue' in typedValue) return null;
  if ('arrayValue' in typedValue) {
    const values = (typedValue.arrayValue as { values?: unknown[] }).values || [];
    return values.map(firestoreValueToJs);
  }
  if ('mapValue' in typedValue) {
    const fields = (typedValue.mapValue as { fields?: Record<string, unknown> }).fields || {};
    return firestoreFieldsToJs(fields);
  }

  return undefined;
}

function firestoreFieldsToJs(fields: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, firestoreValueToJs(value)])
  );
}

async function getPostBySlugPublicServer(slug: string): Promise<Post | null> {
  const config = getPublicFirebaseConfig();
  if (!config) return null;

  try {
    const url = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents:runQuery?key=${config.apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'posts' }],
          where: {
            compositeFilter: {
              op: 'AND',
              filters: [
                {
                  fieldFilter: {
                    field: { fieldPath: 'slug' },
                    op: 'EQUAL',
                    value: { stringValue: slug },
                  },
                },
                {
                  fieldFilter: {
                    field: { fieldPath: 'status' },
                    op: 'EQUAL',
                    value: { stringValue: 'published' },
                  },
                },
              ],
            },
          },
          limit: 1,
        },
      }),
      cache: 'no-store',
    });

    if (!response.ok) return null;

    const results = (await response.json()) as Array<{
      document?: {
        name: string;
        fields?: Record<string, unknown>;
      };
    }>;
    const match = results.find((result) => result.document);

    if (!match?.document?.fields) return null;

    const data = firestoreFieldsToJs(match.document.fields);
    const id = match.document.name.split('/').pop() || '';

    return {
      ...data,
      id,
      authorName: (data.authorName || data.author || '') as string,
      createdAt: toIso(data.createdAt),
      updatedAt: toIso(data.updatedAt),
      publishedAt: data.publishedAt ? toIso(data.publishedAt) : undefined,
      deletedAt: data.deletedAt ? toIso(data.deletedAt) : undefined,
    } as Post;
  } catch (error) {
    console.error('Server: Error fetching post by slug with public Firestore REST:', error);
    return null;
  }
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
    if (!db) return getPostBySlugPublicServer(slug);

    const snapshot = await db
      .collection('posts')
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (snapshot.empty) return getPostBySlugPublicServer(slug);

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
    return getPostBySlugPublicServer(slug);
  }
}

export async function getPostsByCategoryServer(category: string): Promise<Post[]> {
  try {
    const db = await getAdminDb();
    if (!db) return [];

    const snapshot = await db
      .collection('posts')
      .where('status', '==', 'published')
      .where('category', '==', category)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: toIso(data.createdAt),
          updatedAt: toIso(data.updatedAt),
          publishedAt: data.publishedAt ? toIso(data.publishedAt) : undefined,
          deletedAt: data.deletedAt ? toIso(data.deletedAt) : undefined,
        } as Post;
      })
      .filter((post) => !post.deletedAt);
  } catch (error) {
    console.error('Server: Error fetching posts by category:', error);
    return [];
  }
}

export async function getCategoryBySlugServer(slug: string): Promise<{ id?: string; name: string; slug?: string; description?: string; subDescription?: string; subDescriptionLabel?: string; color?: string; featuredImage?: string } | null> {
  try {
    const db = await getAdminDb();
    if (!db) return null;

    const snapshot = await db
      .collection('categories')
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      subDescription: data.subDescription,
      subDescriptionLabel: data.subDescriptionLabel,
      color: data.color,
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
