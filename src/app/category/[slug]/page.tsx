'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';
import { getAllPostsTyped, getCategories } from '@/lib/firestore';
import type { Post, Category } from '@/types';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params);
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      try {
        setLoading(true);

        // Get all categories from Firestore
        const categoriesData = await getCategories();
        setAllCategories(categoriesData);

        // Find the category by slug
        const foundCategory = categoriesData.find((c) => c.slug === slug);
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
        {/* Category Hero Section */}
        <div className="relative w-full h-[600px] bg-gray-200 overflow-hidden">
          {/* Background Image */}
          {category?.featuredImage && (
            <img
              src={category.featuredImage}
              alt={category.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/70" />

          {/* Title & Description Overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 px-4 w-full py-16 pb-32">
            <div className="text-center">
              <div className="font-unbounded font-medium text-[32px] text-white text-center leading-[110%] tracking-[-0.02em] max-w-4xl mx-auto mb-4">
                {(category?.name || 'Category').toUpperCase()}
              </div>
              {category?.description && (
                <p className="text-sm font-light text-white/90 text-center max-w-2xl mx-auto mb-4">
                  {category.description}
                </p>
              )}
            </div>
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
                    className="bg-white overflow-hidden transition transform hover:scale-105 group"
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
                      <span className="text-xs text-gray-500 block mb-2 uppercase">{post.author}</span>
                      <div className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition line-clamp-2">
                        {post.title}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Browse Other Categories */}
              {allCategories.length > 0 && (
              <div className="mt-16 pt-12 border-t border-gray-300">
                <div className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  Browse Other Categories
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {allCategories
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
                        <div className="font-bold text-gray-900 group-hover:text-orange-600 transition">
                          {cat.name}
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
