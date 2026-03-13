/**
 * Core domain types
 */

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
  author: string;
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
