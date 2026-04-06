"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import BlogContent from "@/components/BlogContent";
import { getAllPostsTyped } from "@/lib/firestore";
import { getUserProfile } from "@/lib/users";
import type { Post, UserProfile } from "@/types";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPost({ params }: BlogPageProps) {
  const { slug } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [authorProfile, setAuthorProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        // Get all posts from Firestore
        const allPosts = await getAllPostsTyped();

        // Filter only published posts
        const publishedPosts = allPosts.filter((p) => p.status === "published");

        const foundPost = publishedPosts.find((p) => p.slug === slug);

        if (foundPost) {
          setPost(foundPost);
          // Fetch author profile
          if (foundPost.authorId) {
            try {
              const profile = await getUserProfile(foundPost.authorId);
              if (profile) {
                setAuthorProfile(profile);
              }
            } catch (error) {
              console.error('Error fetching author profile:', error);
            }
          }
          // Get related posts from same category (excluding current post)
          const related = publishedPosts
            .filter(
              (p) => p.category === foundPost.category && p.id !== foundPost.id,
            )
            .slice(0, 4);

          setRelatedPosts(related);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
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
            <div className="text-3xl font-bold text-gray-900 mb-4">
              Post not found
            </div>
            <p className="text-gray-600 mb-8">
              The post you're looking for doesn't exist.
            </p>
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
        {/* Hero Image — full viewport minus header */}
        {post?.featuredImage ? (
          <div className="relative w-full bg-gray-200 overflow-hidden" style={{ height: 'calc(100dvh - 67px)' }}>
            <img
              src={post.featuredImage}
              alt={post.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/50" />
          </div>
        ) : null}

        {/* Post Meta — below hero */}
        <div className="px-6 sm:px-12 lg:px-24 py-10 lg:py-14 border-b border-black/10 text-center">
          {post?.category && (
            <p className="heading-main-category text-black mb-4">{post.category}</p>
          )}
          <div className="heading-post-title text-black max-w-4xl mx-auto mb-5">
            {post?.title}
          </div>
          {post?.excerpt && (
            <p className="text-article-paragraph text-black/70 max-w-3xl mx-auto mb-6">
              {post.excerpt}
            </p>
          )}
          <p className="text-subcategory text-black/60">
            BY {authorProfile?.displayName || post?.authorName || post?.author || 'Unknown'}
            {post?.publishedAt && (
              <>
                {' | '}
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }).toUpperCase()}
              </>
            )}
          </p>
        </div>

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
          {/* Article Body */}
          <BlogContent html={post?.content || ""} />

          {/* Author Bio */}
          <div className="mb-12 pt-10 border-t border-black/20">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Author Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 sm:w-36 sm:h-36 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl overflow-hidden">
                  {authorProfile?.avatarUrl ? (
                    <img src={authorProfile.avatarUrl} alt={post?.author} className="w-full h-full object-cover" />
                  ) : (
                    post?.author?.charAt(0)
                  )}
                </div>
              </div>
              {/* Author Info */}
              <div className="flex-1">
                <div className="text-sm font-light text-black mb-3">
                  Words: {authorProfile?.displayName || post?.author || post?.authorName}
                  {' // '}
                  {authorProfile?.socialLinks?.instagram ? (
                    <a href={authorProfile.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      @{authorProfile.socialLinks.instagram.split('/').pop()}
                    </a>
                  ) : (
                    `@${(authorProfile?.displayName || post?.author)?.toLowerCase().replace(/\s+/g, '')}`
                  )}
                </div>
                {/* Author Details */}
                {(authorProfile?.details || authorProfile?.bio) && (
                  <p className="text-sm font-light text-black leading-relaxed">
                    {authorProfile.details || authorProfile.bio}
                  </p>
                )}
              </div>
            </div>
          </div>

        </article>

        {/* Related Posts - Full Width */}
        {relatedPosts.length > 0 && (
          <section className="w-full">
            <div className="w-full px-6 sm:px-8 lg:px-12">
              <div className="py-4 border-b border-gray-900/20">
                <div className="text-xl font-light uppercase">
                  Related Stories
                </div>
              </div>
            </div>
            <div className="w-full px-6 sm:px-8 lg:px-12 py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="relative group overflow-hidden h-80 bg-gray-200"
                  >
                    {relatedPost.featuredImage && (
                      <img
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    )}
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition" />
                    {/* Text Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <p className="text-xs text-white/80 uppercase tracking-widest mb-2">
                        <span className="font-light">{relatedPost.category}</span>
                        {relatedPost.authorName && (
                          <>
                            <span className="font-light"> + </span>
                            <span className="font-light">{relatedPost.authorName}</span>
                          </>
                        )}
                      </p>
                      <div className="text-lg font-light text-white leading-tight line-clamp-3">
                        {relatedPost.title}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
