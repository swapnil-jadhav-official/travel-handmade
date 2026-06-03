'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';
import { getAllPostsTyped, getCategories } from '@/lib/firestore';
import type { Post, Category } from '@/types';

const POSTS_PER_PAGE = 16;

export default function CategoryPageContent({ slug }: { slug: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoryNotFound, setCategoryNotFound] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      try {
        setLoading(true);
        const categoriesData = await getCategories();
        const foundCategory = categoriesData.find((c) => c.slug === slug);
        if (!foundCategory) { setCategoryNotFound(true); return; }
        setCategory(foundCategory);
        const allPosts = await getAllPostsTyped();
        const categoryPosts = allPosts
          .filter((p) => p.status === 'published' && p.category === slug);
        setPosts(categoryPosts);
      } catch (error) {
        console.error('Error fetching category posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryPosts();
  }, [slug]);

  if (categoryNotFound) notFound();

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const pagePosts = posts.slice(page * POSTS_PER_PAGE, (page + 1) * POSTS_PER_PAGE);
  const progress = totalPages > 1 ? ((page + 1) / totalPages) * 100 : 100;

  return (
    <>
      <Header />
      <main className="bg-white min-h-screen">
        {/* Hero */}
        <div className="relative w-full bg-gray-200 overflow-hidden" style={{ height: 'calc(100dvh - 67px)' }}>
          {category?.featuredImage && (
            <img src={category.featuredImage} alt={category.name} className="absolute inset-0 h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70" />
          <div className="absolute left-0 right-0 z-10 flex flex-col items-center px-6" style={{ bottom: '29px' }}>
            <div className="order-first mb-[72px] w-full flex flex-col items-center text-center">
              <div className="heading-post-title text-white text-center max-w-3xl mx-auto mb-3">
                {(category?.name || 'Category').toUpperCase()}
              </div>
              {category?.description && (
                <p className="text-subcategory text-white/80 text-center max-w-2xl mx-auto" style={{ textTransform: 'none' }}>
                  {category.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sub Description Bar */}
        {category?.subDescription && (
          <div className="w-full px-6 sm:px-8 lg:px-12 py-12 lg:py-20">
            <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide justify-start lg:justify-center whitespace-nowrap">
              {category.subDescriptionLabel && (
                <span className="heading-nav text-black">{category.subDescriptionLabel}</span>
              )}
              {category.subDescriptionLabel && <span className="w-8 h-px bg-black flex-shrink-0" />}
              {category.subDescription.split(',').map((item, i, arr) => (
                <span key={i} className="flex items-center gap-4">
                  <span className="heading-nav text-black">{item.trim()}</span>
                  {i < arr.length - 1 && <span className="text-black/30">•</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Posts Grid */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-14 lg:gap-y-16">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <div className="relative w-full aspect-square bg-gray-200 animate-pulse" />
                  <div className="pt-4 pb-2 space-y-2">
                    <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
                    <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
                    <div className="h-3 w-1/2 bg-gray-100 animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg mb-4">No posts found in this category</p>
              <Link href="/" className="text-blue-600 hover:underline">← Back to home</Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-14 lg:gap-y-16">
                {pagePosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="bg-white overflow-hidden group">
                    {post.featuredImage && (
                      <div className="relative w-full aspect-square bg-gray-200 overflow-hidden">
                        <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="pt-4 pb-2">
                      <div className="heading-card-title text-black mb-2">{post.title}</div>
                      <span className="text-card-author text-black">{post.authorName || post.author}</span>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-16 flex items-center gap-6">
                  <button
                    onClick={() => { setPage((p) => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    disabled={page === 0}
                    className="heading-nav text-black disabled:opacity-20 transition"
                  >
                    ← PREV
                  </button>
                  <div className="flex-1 h-px bg-black/10 relative">
                    <div className="absolute top-0 left-0 h-full bg-black transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-card-author text-black/40">{page + 1} / {totalPages}</span>
                  <button
                    onClick={() => { setPage((p) => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    disabled={page === totalPages - 1}
                    className="heading-nav text-black disabled:opacity-20 transition"
                  >
                    NEXT →
                  </button>
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
