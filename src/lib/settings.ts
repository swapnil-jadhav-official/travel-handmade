import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface SiteSettings {
  logoUrl?: string;
  siteName?: string;
  siteDescription?: string;
  featuredVideoUrl?: string;
  featuredVideoTitle?: string;
  featuredVideoCreator?: string;
  heroPostIds?: string[];
  updatedAt?: string;
}

const SETTINGS_COLLECTION = 'settings';
const SETTINGS_DOC = 'general';

/**
 * Get site settings
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as SiteSettings;
    }
    return null;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    throw error;
  }
}

/**
 * Update site settings
 */
export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC);
    await setDoc(
      docRef,
      {
        ...settings,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error updating site settings:', error);
    throw error;
  }
}
