import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import type { UserProfile, Post } from '@/types';

const USERS_COLLECTION = 'users';

/**
 * Get a user profile by UID
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    throw error;
  }
}

/**
 * Get all user profiles (for author selection dropdowns)
 */
export async function getAllUserProfiles(): Promise<UserProfile[]> {
  try {
    const collectionRef = collection(db, USERS_COLLECTION);
    const q = query(collectionRef, orderBy('displayName', 'asc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => doc.data() as UserProfile);
  } catch (error) {
    throw error;
  }
}

/**
 * Create a new user profile (called after Auth user is created)
 */
export async function createUserProfile(
  uid: string,
  data: Omit<UserProfile, 'uid'>
): Promise<void> {
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    await setDoc(docRef, {
      uid,
      ...data,
    } as UserProfile);
  } catch (error) {
    throw error;
  }
}

/**
 * Update a user profile
 */
export async function updateUserProfile(
  uid: string,
  data: Partial<Omit<UserProfile, 'uid'>>
): Promise<void> {
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Delete a user profile
 */
export async function deleteUserProfile(uid: string): Promise<void> {
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting user ${uid}:`, error);
    throw error;
  }
}

/**
 * Get all posts by a specific author
 * Used for filtering posts by author role and counting author posts
 */
export async function getPostsByAuthor(authorId: string): Promise<Post[]> {
  try {
    const collectionRef = collection(db, 'posts');
    const q = query(
      collectionRef,
      where('authorId', '==', authorId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
      publishedAt: doc.data().publishedAt?.toDate?.()?.toISOString() || doc.data().publishedAt,
    } as Post));
  } catch (error) {
    console.error(`Error fetching posts for author ${authorId}:`, error);
    throw error;
  }
}
