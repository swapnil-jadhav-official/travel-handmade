import { getPostBySlugServer } from '@/lib/firestore-server';
import BlogPostContent from './BlogPostContent';

interface BlogPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string }>;
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const initialPost = query?.preview === 'true' ? null : await getPostBySlugServer(slug);

  return <BlogPostContent slug={slug} initialPost={initialPost} />;
}
