'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';
import { getAllPostsTyped } from '@/lib/firestore';
import type { Post } from '@/types';

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPost({ params }: BlogPageProps) {
  const { slug } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        // Get all posts from Firestore
        const allPosts = await getAllPostsTyped();
        // Filter only published posts
        const publishedPosts = allPosts.filter((p) => p.status === 'published');
        const foundPost = publishedPosts.find((p) => p.slug === slug);

        if (foundPost) {
          setPost(foundPost);
          // Get related posts from same category (excluding current post)
          const related = publishedPosts
            .filter((p) => p.category === foundPost.category && p.id !== foundPost.id)
            .slice(0, 3);
          setRelatedPosts(related);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-gray-500 text-center">Loading...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Post not found</h1>
            <p className="text-gray-600 mb-8">The post you're looking for doesn't exist.</p>
            <Link href="/" className="text-blue-600 hover:underline">
              ← Back to home
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Hero Image */}
        {post?.featuredImage && (
          <div className="relative w-full h-96 bg-gray-200 overflow-hidden">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
          {/* Metadata */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-semibold text-orange-600 uppercase">
                {post?.category}
              </span>
              <span className="text-sm text-gray-500">
                {post?.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : ''}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {post?.title}
            </h1>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm font-semibold text-gray-900">By {post?.author}</p>
                <p className="text-sm text-gray-500">{post?.views || 0} views</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                  📌 Save
                </button>
                <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                  📤 Share
                </button>
              </div>
            </div>
          </div>

          {/* Article Body */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg text-gray-600 italic mb-8">{post?.excerpt}</p>
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post?.content || '' }}
            />
          </div>

          {/* Author Bio */}
          <div className="bg-gray-50 rounded-lg p-8 mb-12 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                {post?.author.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{post?.author}</h3>
                <p className="text-gray-600">Travel enthusiast and content creator</p>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition group"
                  >
                    {relatedPost.featuredImage && (
                      <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
                        <img
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <span className="text-xs font-semibold text-orange-600 uppercase">
                        {relatedPost.category}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mt-2 group-hover:text-orange-600 transition line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Back Link */}
          <div className="pt-8 border-t border-gray-200">
            <Link
              href="/"
              className="text-blue-600 hover:underline text-sm font-semibold"
            >
              ← Back to all posts
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
