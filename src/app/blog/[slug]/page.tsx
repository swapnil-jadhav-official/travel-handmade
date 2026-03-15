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
            .slice(0, 3);

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
        {/* Hero Image with Title Overlay */}
        {post?.featuredImage ? (
          <div className="relative w-full h-[600px] bg-gray-200 overflow-hidden">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Gradient Overlay - Dark at bottom, transparent at top */}
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.7) 100%)'
            }} />
            {/* Title and Category Overlay */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 px-4 w-full py-12">
              <div className="text-center">
                <p className="font-unbounded font-light text-sm text-white uppercase tracking-widest mb-3">
                  {post?.category}
                </p>
                <div className="font-unbounded font-medium text-[32px] text-white text-center leading-[110%] tracking-[-0.02em] max-w-4xl mx-auto mb-4">
                  {post?.title}
                </div>
                {post?.excerpt && (
                  <p className="text-sm font-light text-white/90 text-center max-w-2xl mx-auto mb-6">
                    {post.excerpt}
                  </p>
                )}
                {/* Author & Date */}
                <p className="text-xs text-white uppercase tracking-widest">
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
            </div>
          </div>
        ) : null}

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
          {/* Article Body */}
          <BlogContent html={post?.content || ""} />

          {/* Author Bio */}
          <div className="mb-12">
            <div className="flex gap-6">
              {/* Author Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                  {authorProfile?.avatarUrl ? (
                    <img src={authorProfile.avatarUrl} alt={post?.author} className="w-full h-full object-cover" />
                  ) : (
                    post?.author?.charAt(0)
                  )}
                </div>
              </div>
              {/* Author Info */}
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-3">
                  <div className="text-sm text-black">
                    {authorProfile?.displayName || post?.author || post?.authorName}
                  </div>
                  <span className="text-sm text-black">
                    {authorProfile?.socialLinks?.instagram ? (
                      <a href={authorProfile.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        @{authorProfile.socialLinks.instagram.split('/').pop()}
                      </a>
                    ) : (
                      `@${(authorProfile?.displayName || post?.author)?.toLowerCase().replace(/\s+/g, '')}`
                    )}
                  </span>
                </div>
                {/* Author Details */}
                {(authorProfile?.details || authorProfile?.bio) && (
                  <p className="text-sm text-black leading-relaxed">
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
            <div className="w-full px-6 py-4 lg:px-8 border-t border-b border-gray-900/20">
              <div className="text-xl font-light uppercase">
                Related Stories
              </div>
            </div>
            <div className="w-full px-6 py-12 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
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
