'use client';

import { useEffect, useState } from 'react';
import SectionTracker from '@/components/SectionTracker';
import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';
import HeroCarousel from '@/components/sections/HeroCarousel';
import LatestArticles from '@/components/sections/LatestArticles';
import TravelLiving from '@/components/sections/TravelLiving';
import AdventureWildlife from '@/components/sections/AdventureWildlife';
import FoodDrinks from '@/components/sections/FoodDrinks';
import Retreats from '@/components/sections/Retreats';
import Wellness from '@/components/sections/Wellness';
import ChangeMaker from '@/components/sections/ChangeMaker';
import TravellerSection from '@/components/sections/Traveller';
import { getAllPostsTyped, getTestimonials, getTravellers } from '@/lib/firestore';
import { getSiteSettings } from '@/lib/settings';
import type { Post, Testimonial, Traveller } from '@/types';
import type { SiteSettings } from '@/lib/settings';

interface HomeContentProps {
  posts: Post[];
  testimonials: Testimonial[];
  travellers: Traveller[];
  settings: SiteSettings | null;
}

export function HomeContent({
  posts: initialPosts,
  testimonials: initialTestimonials,
  travellers: initialTravellers,
  settings: initialSettings,
}: HomeContentProps) {
  const hasServerData = initialPosts.length > 0;

  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [travellers, setTravellers] = useState<Traveller[]>(initialTravellers);
  const [settings, setSettings] = useState<SiteSettings | null>(initialSettings);
  const [loading, setLoading] = useState(!hasServerData);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [retryTrigger, setRetryTrigger] = useState(0);

  // Only fetch client-side if server didn't provide data (admin credentials not configured)
  useEffect(() => {
    if (hasServerData) return;

    let attempt = 0;
    const MAX_ATTEMPTS = 4;
    const RETRY_DELAYS = [4000, 8000, 16000]; // 4s, 8s, 16s backoff

    const fetchData = async () => {
      try {
        const [allPosts, testimonialData, travellerData, siteSettings] = await Promise.all([
          getAllPostsTyped(),
          getTestimonials(),
          getTravellers(),
          getSiteSettings(),
        ]);

        const publishedPosts = allPosts
          .filter((p) => p.status === 'published')
          .sort((a, b) => {
            const dateA = a.publishedAt || a.createdAt;
            const dateB = b.publishedAt || b.createdAt;
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          });

        setPosts(publishedPosts);
        setTestimonials(testimonialData);
        setTravellers(travellerData);
        setSettings(siteSettings);
        setLoading(false);
      } catch (error) {
        console.error(`Failed to fetch data (attempt ${attempt + 1}):`, error);
        attempt++;
        if (attempt < MAX_ATTEMPTS) {
          // Keep skeleton visible and retry after delay
          setTimeout(fetchData, RETRY_DELAYS[attempt - 1]);
        } else {
          // All retries exhausted — stop skeleton and show error
          setLoading(false);
          setFetchFailed(true);
        }
      }
    };

    fetchData();
  }, [hasServerData, retryTrigger]);

  if (fetchFailed) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-6 px-6 text-center">
          <p className="font-unbounded text-lg text-black">Unable to connect</p>
          <p className="text-sm text-gray-500 max-w-sm">
            Check your internet connection and try again.
          </p>
          <button
            onClick={() => { setFetchFailed(false); setLoading(true); setRetryTrigger((n) => n + 1); }}
            className="px-6 py-3 bg-black text-white text-sm font-unbounded hover:bg-black/80 transition"
          >
            Retry
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const featuredVideo = settings?.featuredVideoUrl
    ? {
        url: settings.featuredVideoUrl,
        title: settings.featuredVideoTitle,
        creator: settings.featuredVideoCreator,
        thumbnail: settings.featuredVideoThumbnail,
      }
    : null;

  const postsAsArticles = posts.map((post) => ({
    id: post.id,
    title: post.title,
    image: post.featuredImage || '',
    slug: post.slug,
    category: post.category,
    date: post.publishedAt
      ? new Date(post.publishedAt)
          .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          .toUpperCase()
      : '',
    author: post.authorName,
    readTime: post.readTime,
    authorLocation: post.authorLocation,
    authorCity: post.authorCity,
    authorCountry: post.authorCountry,
  }));

  const heroPostIds = settings?.heroPostIds ?? [];
  const heroImages = heroPostIds
    .map((id) => posts.find((p) => p.id === id))
    .filter(Boolean)
    .map((post) => ({
      id: post!.id,
      image: post!.featuredImage!,
      title: post!.title,
      link: post!.slug,
    }));

  const latestArticles = postsAsArticles.slice(0, 4);
  const travelLivingArticles = postsAsArticles.filter((p) => p.category === 'travel-living').slice(0, 3);
  const adventureArticles = postsAsArticles.filter((p) => p.category === 'adventure-wildlife').slice(0, 3);
  const foodDrinksArticles = postsAsArticles.filter((p) => p.category === 'food-drinks');
  const retreatsArticles = postsAsArticles.filter((p) => p.category === 'retreats').slice(0, 3);
  const wellnessArticles = postsAsArticles.filter((p) => p.category === 'wellness').slice(0, 3);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-1 w-full">
          {/* Hero skeleton — mirrors HeroCarousel structure */}
          <section className="relative w-full overflow-hidden bg-gray-300">
            <div className="relative w-full animate-pulse" style={{ height: 'calc(100dvh - 67px)' }}>
              {/* Gradient overlay matching real hero */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.35) 100%)' }}
              />
              {/* Bottom: title lines + dots, pinned exactly like real hero */}
              <div className="absolute left-0 right-0 flex flex-col items-center px-6" style={{ bottom: '29px' }}>
                <div className="flex gap-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-white/60' : 'bg-white/25'}`} />
                  ))}
                </div>
                <div className="order-first mb-8 lg:mb-18 w-full flex flex-col items-center gap-3">
                  <div className="h-7 w-2/3 rounded bg-white/20" />
                  <div className="h-7 w-1/2 rounded bg-white/15" />
                </div>
              </div>
              {/* Arrow placeholders */}
              <div className="absolute left-6 top-1/2 -translate-y-1/2 h-8 w-8 rounded bg-white/20" />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 h-8 w-8 rounded bg-white/20" />
            </div>
          </section>

          {/* Latest Articles skeleton */}
          <div className="w-full flex flex-col lg:flex-row lg:h-dvh px-6 sm:px-8 lg:px-12 py-10 lg:py-12 gap-8">
            <div className="flex-1 flex flex-col gap-6">
              <div className="h-6 w-40 bg-gray-200 animate-pulse rounded" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2 py-4 border-b border-gray-100">
                  <div className="h-3 w-24 bg-gray-100 animate-pulse rounded" />
                  <div className="h-5 w-full bg-gray-200 animate-pulse rounded" />
                  <div className="h-5 w-3/4 bg-gray-200 animate-pulse rounded" />
                </div>
              ))}
            </div>
            <div className="hidden lg:block w-122.5 bg-gray-200 animate-pulse" />
          </div>

          {/* Section skeleton (repeated for 2 more sections) */}
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="w-full px-6 sm:px-8 lg:px-12 py-10 lg:py-12">
              <div className="h-6 w-48 bg-gray-200 animate-pulse rounded mb-8" />
              <div className="flex gap-6">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="flex-1 space-y-3">
                    <div className="w-full aspect-video bg-gray-200 animate-pulse" />
                    <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
                    <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-1 w-full space-y-8 lg:space-y-12">
        {heroImages.length > 0 && (
          <div className="relative">
            <SectionTracker sectionName="Hero" />
            <HeroCarousel images={heroImages} />
          </div>
        )}
        {!loading && latestArticles.length > 0 && (
          <div className="relative">
            <SectionTracker sectionName="Latest Articles" />
            <LatestArticles articles={latestArticles} />
          </div>
        )}
        {!loading && travelLivingArticles.length > 0 && (
          <div className="relative">
            <SectionTracker sectionName="Travel Living" />
            <TravelLiving articles={travelLivingArticles} />
          </div>
        )}
        {!loading && adventureArticles.length > 0 && (
          <div className="relative">
            <SectionTracker sectionName="Adventure Wildlife" />
            <AdventureWildlife articles={adventureArticles} />
          </div>
        )}
        {!loading && foodDrinksArticles.length > 0 && (
          <div className="relative">
            <SectionTracker sectionName="Food Drinks" />
            <FoodDrinks articles={foodDrinksArticles} />
          </div>
        )}
        {!loading && retreatsArticles.length > 0 && (
          <div className="relative">
            <SectionTracker sectionName="Retreats" />
            <Retreats articles={retreatsArticles} />
          </div>
        )}
        {!loading && wellnessArticles.length > 0 && (
          <div className="relative">
            <SectionTracker sectionName="Wellness" />
            <Wellness articles={wellnessArticles} />
          </div>
        )}
        {!loading && testimonials.length > 0 && (
          <div className="relative">
            <SectionTracker sectionName="Changemaker" />
            <ChangeMaker testimonials={testimonials} featuredVideo={featuredVideo} />
          </div>
        )}
        {!loading && travellers.length > 0 && (
          <div className="relative">
            <SectionTracker sectionName="Traveller" />
            <TravellerSection travellers={travellers} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
