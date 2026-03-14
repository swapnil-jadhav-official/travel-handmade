/**
 * Core domain types
 */

// Authentication & User Management
export type UserRole = 'super_admin' | 'editor' | 'author' | 'contributor';

export interface UserProfile {
  uid: string;              // Firebase Auth UID
  email: string;
  displayName: string;
  bio?: string;
  details?: string;         // Author details/description
  avatarUrl?: string;       // Cloudinary URL
  city?: string;
  country?: string;
  role: UserRole;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Post types
export type PostStatus = 'draft' | 'published' | 'scheduled';
export type PostVisibility = 'public' | 'private' | 'password';

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  authorId: string;         // Firebase UID
  authorName: string;       // Display name (denormalized for fast reads)
  author?: string;          // Deprecated, use authorName
  authorLocation?: string;
  authorCity?: string;      // Author's city (denormalized for fast reads)
  authorCountry?: string;   // Author's country (denormalized for fast reads)
  status: PostStatus;
  visibility: PostVisibility;
  password?: string;
  scheduledAt?: string;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  title: string;
  image: string;
  slug: string;
  category?: string;
  date?: string;
  author?: string;
  authorLocation?: string;
  authorCity?: string;
  authorCountry?: string;
}

export interface HeroImage {
  id: string;
  image: string;
  title: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  image: string;
  articleTitle?: string;
  videoUrl?: string;
  videoTitle?: string;
  videoSubtitle?: string;
}

export interface Traveller {
  id: string;
  country: string;
  traveller_name: string;
  image: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  author: string;
  date: string;
  image: string;
  slug: string;
  featured?: boolean;
  views?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}
