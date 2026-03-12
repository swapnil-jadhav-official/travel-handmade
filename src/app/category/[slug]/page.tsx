'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';
import { getAllPostsTyped } from '@/lib/firestore';
import { categories } from '@/data/mockData';
import type { Post, Category } from '@/types';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params);
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      try {
        setLoading(true);

        // Find the category by slug
        const foundCategory = categories.find((c) => c.slug === slug);
        setCategory(foundCategory || null);

        if (foundCategory) {
          // Get all published posts from Firestore
          const allPosts = await getAllPostsTyped();
          const publishedPosts = allPosts.filter((p) => p.status === 'published');

          // Filter posts by category slug
          const categoryPosts = publishedPosts.filter((p) => p.category === slug);
          setPosts(categoryPosts);
        }
      } catch (error) {
        console.error('Error fetching category posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryPosts();
  }, [slug]);

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        {/* Category Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {category?.name || 'Category'}
            </h1>
            <p className="text-lg opacity-90">
              {category?.description || 'Explore posts in this category'}
            </p>
            {posts.length > 0 && (
              <p className="text-sm opacity-75 mt-4">
                {posts.length} {posts.length === 1 ? 'post' : 'posts'} found
              </p>
            )}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {loading ? (
            <p className="text-center text-gray-500">Loading posts...</p>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg mb-4">No posts found in this category</p>
              <Link href="/" className="text-blue-600 hover:underline">
                ← Back to home
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition transform hover:scale-105 group"
                  >
                    {post.featuredImage && (
                      <div className="relative h-56 w-full bg-gray-200 overflow-hidden">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-orange-600 uppercase">
                          {post.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : ''}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-500">By {post.author}</span>
                        <span className="text-xs text-gray-500">{post.views || 0} views</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Browse Other Categories */}
              <div className="mt-16 pt-12 border-t border-gray-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  Browse Other Categories
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {categories
                    .filter((c) => c.slug !== slug)
                    .map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        className="p-4 bg-white rounded-lg text-center hover:shadow-lg transition group"
                      >
                        <div
                          className="h-2 rounded mb-3"
                          style={{ backgroundColor: cat.color }}
                        ></div>
                        <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition">
                          {cat.name}
                        </h3>
                      </Link>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
