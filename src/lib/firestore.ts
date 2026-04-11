import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { BlogPost, Post, PostStatus, Category, Testimonial, Traveller } from '@/types';

const POSTS_COLLECTION = 'posts';
const CATEGORIES_COLLECTION = 'categories';
const TESTIMONIALS_COLLECTION = 'testimonials';
const TRAVELLERS_COLLECTION = 'travellers';

// Helper function to convert Firestore Timestamp to ISO string
const convertTimestamp = (timestamp: any): string => {
  if (!timestamp) return '';
  if (typeof timestamp === 'string') return timestamp;
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    try {
      return timestamp.toDate().toISOString();
    } catch (error) {
      return '';
    }
  }
  return '';
};

// Create a new blog post
export async function createPost(postData: Omit<BlogPost, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
      ...postData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return { id: docRef.id, ...postData };
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

// Get all blog posts
export async function getAllPosts() {
  try {
    const q = query(
      collection(db, POSTS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as BlogPost[];
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

// Get post by ID
export async function getPostById(postId: string) {
  try {
    const docRef = doc(db, POSTS_COLLECTION, postId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as BlogPost;
    }
    return null;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
}

// Get posts by category
export async function getPostsByCategory(category: string) {
  try {
    const q = query(
      collection(db, POSTS_COLLECTION),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as BlogPost[];
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    throw error;
  }
}

// Update a blog post
export async function updatePost(postId: string, postData: Partial<BlogPost>) {
  try {
    const docRef = doc(db, POSTS_COLLECTION, postId);
    await updateDoc(docRef, {
      ...postData,
      updatedAt: Timestamp.now(),
    });
    return { id: postId, ...postData };
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}

// Delete a blog post
export async function deletePost(postId: string) {
  try {
    await deleteDoc(doc(db, POSTS_COLLECTION, postId));
    return postId;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

// ===== Typed Post operations for admin editor =====

export async function createPostDraft(
  data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'views'>
): Promise<string> {
  try {
    console.log('[Firestore] Creating draft post with data:', data);
    const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
      ...data,
      views: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    console.log('[Firestore] Draft post created successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('[Firestore] Error creating draft post:', error);
    throw error;
  }
}

export async function getPostTyped(postId: string): Promise<Post | null> {
  try {
    console.log('[Firestore] Getting post with ID:', postId);
    const docRef = doc(db, POSTS_COLLECTION, postId);
    const docSnap = await getDoc(docRef);
    console.log('[Firestore] Document exists:', docSnap.exists());
    if (docSnap.exists()) {
      const rawData = docSnap.data();
      const data: Post = {
        id: docSnap.id,
        ...rawData,
        // Fall back to deprecated `author` field for old posts
        authorName: rawData.authorName || rawData.author || '',
        createdAt: convertTimestamp(rawData.createdAt),
        updatedAt: convertTimestamp(rawData.updatedAt),
        publishedAt: rawData.publishedAt ? convertTimestamp(rawData.publishedAt) : undefined,
      } as Post;
      console.log('[Firestore] Post data retrieved:', data);
      return data;
    }
    console.log('[Firestore] Document does not exist for ID:', postId);
    return null;
  } catch (error) {
    console.error('[Firestore] Error fetching post:', error);
    throw error;
  }
}

export async function getAllPostsTyped(): Promise<Post[]> {
  try {
    const q = query(
      collection(db, POSTS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Fall back to deprecated `author` field for old posts
        authorName: data.authorName || data.author || '',
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
        publishedAt: data.publishedAt ? convertTimestamp(data.publishedAt) : undefined,
      } as Post;
    });
  } catch (error) {
    console.error('Error fetching all posts:', error);
    throw error;
  }
}

export async function getPostsByStatusTyped(status: PostStatus): Promise<Post[]> {
  try {
    const q = query(
      collection(db, POSTS_COLLECTION),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
        publishedAt: data.publishedAt ? convertTimestamp(data.publishedAt) : undefined,
      } as Post;
    });
  } catch (error) {
    console.error('Error fetching posts by status:', error);
    throw error;
  }
}

export async function updatePostTyped(
  postId: string,
  data: Partial<Post>
): Promise<void> {
  try {
    const docRef = doc(db, POSTS_COLLECTION, postId);
    // Strip undefined values — Firestore rejects them
    const cleanData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleanData[key] = value;
      }
    }
    await updateDoc(docRef, {
      ...cleanData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}

export async function publishPost(postId: string): Promise<void> {
  try {
    console.log('[Firestore] Publishing post with ID:', postId);
    const docRef = doc(db, POSTS_COLLECTION, postId);
    console.log('[Firestore] Updating document with status=published...');
    await updateDoc(docRef, {
      status: 'published',
      publishedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    console.log('[Firestore] Post published successfully!');
  } catch (error) {
    console.error('[Firestore] Error publishing post:', error);
    throw error;
  }
}

// ===== Category operations =====

export async function createCategory(data: Omit<Category, 'id'>): Promise<string> {
  try {
    console.log('[Firestore] Creating category:', data.name);
    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), data);
    console.log('[Firestore] Category created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('[Firestore] Error creating category:', error);
    throw error;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const q = query(collection(db, CATEGORIES_COLLECTION), orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Category[];
  } catch (error) {
    console.error('[Firestore] Error fetching categories:', error);
    throw error;
  }
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<void> {
  try {
    console.log('[Firestore] Updating category:', id);
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await updateDoc(docRef, data);
    console.log('[Firestore] Category updated successfully!');
  } catch (error) {
    console.error('[Firestore] Error updating category:', error);
    throw error;
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    console.log('[Firestore] Deleting category:', id);
    await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
    console.log('[Firestore] Category deleted successfully!');
  } catch (error) {
    console.error('[Firestore] Error deleting category:', error);
    throw error;
  }
}

// ===== Author-specific post queries =====

export async function getPostsByAuthorTyped(authorId: string): Promise<Post[]> {
  try {
    const q = query(
      collection(db, POSTS_COLLECTION),
      where('authorId', '==', authorId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
        publishedAt: data.publishedAt ? convertTimestamp(data.publishedAt) : undefined,
      } as Post;
    });
  } catch (error) {
    console.error('Error fetching posts by author:', error);
    throw error;
  }
}

// ===== Testimonial operations (Change Maker) =====

export async function createTestimonial(data: Omit<Testimonial, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, TESTIMONIALS_COLLECTION), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating testimonial:', error);
    throw error;
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const q = query(collection(db, TESTIMONIALS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Testimonial[];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }
}

export async function updateTestimonial(id: string, data: Partial<Testimonial>): Promise<void> {
  try {
    const docRef = doc(db, TESTIMONIALS_COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    throw error;
  }
}

export async function deleteTestimonial(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, TESTIMONIALS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw error;
  }
}

// ===== Traveller operations =====

export async function createTraveller(data: Omit<Traveller, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, TRAVELLERS_COLLECTION), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating traveller:', error);
    throw error;
  }
}

export async function getTravellers(): Promise<Traveller[]> {
  try {
    const q = query(collection(db, TRAVELLERS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Traveller[];
  } catch (error) {
    console.error('Error fetching travellers:', error);
    throw error;
  }
}

export async function updateTraveller(id: string, data: Partial<Traveller>): Promise<void> {
  try {
    const docRef = doc(db, TRAVELLERS_COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating traveller:', error);
    throw error;
  }
}

export async function deleteTraveller(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, TRAVELLERS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting traveller:', error);
    throw error;
  }
}
