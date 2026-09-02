"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Linkedin } from "lucide-react";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import BlogContent from "@/components/BlogContent";
import ScrollDepthTracker from "@/components/ScrollDepthTracker";
import { getAllPostsTyped, getCategories } from "@/lib/firestore";
import { getUserProfile } from "@/lib/users";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import type { Post, UserProfile } from "@/types";

interface BlogPostContentProps {
  slug: string;
  initialPost?: Post | null;
}

export default function BlogPostContent({ slug, initialPost = null }: BlogPostContentProps) {
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';
  const [post, setPost] = useState<Post | null>(initialPost);
  const [loading, setLoading] = useState(!initialPost || isPreview);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [authorProfile, setAuthorProfile] = useState<UserProfile | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');

  useEffect(() => {
    if (!post?.title) return;
    document.title = `${post.seoTitle || post.title} | Travel Handmade`;
  }, [post?.seoTitle, post?.title]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const allPosts = await getAllPostsTyped();

        const visiblePosts = isPreview
          ? allPosts
          : allPosts.filter((p) => p.status === "published");

        const foundPost = visiblePosts.find((p) => p.slug === slug);

        if (foundPost) {
          setPost(foundPost);
          try {
            const categories = await getCategories();
            const cat = categories.find((c) => c.slug === foundPost.category);
            if (cat) setCategoryName(cat.name);
          } catch (error) {
            console.error('Error fetching categories:', error);
          }
          if (foundPost.authorId) {
            try {
              const profile = await getUserProfile(foundPost.authorId);
              if (profile) setAuthorProfile(profile);
            } catch (error) {
              console.error('Error fetching author profile:', error);
            }
          }
          const related = visiblePosts
            .filter((p) => p.category === foundPost.category && p.id !== foundPost.id)
            .slice(0, 4);
          setRelatedPosts(related);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    const hydrateInitialPost = async (foundPost: Post) => {
      try {
        try {
          const categories = await getCategories();
          const cat = categories.find((c) => c.slug === foundPost.category);
          if (cat) setCategoryName(cat.name);
        } catch (error) {
          console.error('Error fetching categories:', error);
        }

        if (foundPost.authorId) {
          try {
            const profile = await getUserProfile(foundPost.authorId);
            if (profile) setAuthorProfile(profile);
          } catch (error) {
            console.error('Error fetching author profile:', error);
          }
        }

        try {
          const allPosts = await getAllPostsTyped();
          const related = allPosts
            .filter((p) => p.status === "published" && p.category === foundPost.category && p.id !== foundPost.id)
            .slice(0, 4);
          setRelatedPosts(related);
        } catch (error) {
          console.error('Error fetching related posts:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (initialPost && !isPreview) {
      setPost(initialPost);
      hydrateInitialPost(initialPost);
      return;
    }

    fetchPost();
  }, [slug, isPreview, initialPost]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="bg-white">
          <div className="w-full bg-gray-200 animate-pulse" style={{ height: 'calc(100dvh - 67px)' }} />
          <div className="px-6 sm:px-12 lg:px-24 py-10 lg:py-14 border-b border-black/10 flex flex-col items-center gap-4">
            <div className="h-4 w-28 bg-gray-200 animate-pulse rounded" />
            <div className="h-8 w-3/4 bg-gray-200 animate-pulse rounded" />
            <div className="h-8 w-1/2 bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-48 bg-gray-100 animate-pulse rounded" />
          </div>
          <article className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
            <div className="space-y-3">
              {[100, 100, 75, 100, 100, 60, 100, 100, 80].map((w, i) => (
                <div key={i} className="h-4 bg-gray-200 animate-pulse rounded" style={{ width: `${w}%` }} />
              ))}
            </div>
            <div className="mt-8 space-y-3">
              {[100, 90, 100, 100, 70].map((w, i) => (
                <div key={i} className="h-4 bg-gray-200 animate-pulse rounded" style={{ width: `${w}%` }} />
              ))}
            </div>
          </article>
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
            <div className="text-3xl font-bold text-gray-900 mb-4">Post not found</div>
            <p className="text-gray-600 mb-8">The post you're looking for doesn't exist.</p>
            <Link href="/" className="text-blue-600 hover:underline">← Back to home</Link>
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
        <ScrollDepthTracker articleTitle={post.title} />

        {post.featuredImage && (
          <div className="relative w-full bg-gray-200 overflow-hidden" style={{ height: 'calc(100dvh - 67px)' }}>
            <img src={optimizeCloudinaryUrl(post.featuredImage, 1920)} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/50" />
          </div>
        )}

        <div className="px-6 sm:px-12 lg:px-24 py-10 lg:py-14 border-b border-black/10 text-center">
          {post.category && (
            <p className="text-subcategory text-black mb-4">{categoryName || post.category}</p>
          )}
          <div className="heading-post-title text-black max-w-4xl mx-auto mb-5">{post.title}</div>
          {post.excerpt && (
            <p className="text-article-paragraph text-black/70 max-w-3xl mx-auto mb-6">{post.excerpt}</p>
          )}
          <p className="text-subcategory text-black/60">
            BY {authorProfile?.displayName || post.authorName || post.author || 'Unknown'}
            {post.publishedAt && (
              <>{' | '}{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}</>
            )}
          </p>
        </div>

        <article className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
          <BlogContent html={post.content || ""} articleType={post.articleType || 'listicle'} />

          <div className="mt-16 lg:mt-20 pt-12 lg:pt-16 pb-12 lg:pb-16 border-t border-black/20">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 sm:w-36 sm:h-36 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl overflow-hidden">
                  {authorProfile?.avatarUrl ? (
                    <img src={optimizeCloudinaryUrl(authorProfile.avatarUrl, 200)} alt={post.author} className="w-full h-full object-cover" />
                  ) : (
                    post.author?.charAt(0)
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-light text-black mb-4 flex items-center gap-3 flex-wrap">
                  <span>
                    Words: {authorProfile?.displayName || post.author || post.authorName}
                    {' // '}
                    {(() => {
                      const sl = authorProfile?.socialLinks;
                      const social = sl?.instagram || sl?.twitter || sl?.linkedin || sl?.website;
                      if (!social) return `@${(authorProfile?.displayName || post.author)?.toLowerCase().replace(/\s+/g, '')}`;
                      const handle = social.replace(/\/+$/, '').split('/').pop() || social;
                      const isHandle = sl?.instagram || sl?.twitter;
                      return (
                        <a href={social} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {isHandle ? `@${handle}` : handle}
                        </a>
                      );
                    })()}
                  </span>
                  {authorProfile?.socialLinks?.linkedin && (
                    <a href={authorProfile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:opacity-70 transition-opacity">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                </div>
                {(authorProfile?.details || authorProfile?.bio) && (
                  <p className="text-[13px] font-light text-black leading-relaxed">
                    {authorProfile.details || authorProfile.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <section className="w-full" style={{ backgroundColor: '#F5F4F4' }}>
            <div className="w-full px-6 sm:px-8 lg:px-12">
              <div className="pt-10 sm:pt-12 lg:pt-16 pb-4 border-b border-gray-900/20">
                <div className="text-xl font-light uppercase" style={{ fontFamily: 'var(--font-unbounded)' }}>Related Stories</div>
              </div>
            </div>
            <div className="w-full px-6 sm:px-8 lg:px-12 pt-16 lg:pt-20 pb-16 lg:pb-20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="overflow-hidden group">
                    {relatedPost.featuredImage && (
                      <div className="relative w-full aspect-square bg-gray-200 overflow-hidden">
                        <img src={optimizeCloudinaryUrl(relatedPost.featuredImage, 800)} alt={relatedPost.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="pt-4 pb-2">
                      <div className="heading-card-title text-black mb-2">{relatedPost.title}</div>
                      <span className="text-card-author text-black">{relatedPost.authorName || relatedPost.author}</span>
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
