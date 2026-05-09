'use client';

import { useEffect, useState } from 'react';
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
import type { Testimonial, Traveller } from '@/types';
import type { Post } from '@/types';

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>([]);
  const [travellersList, setTravellersList] = useState<Traveller[]>([]);
  const [featuredVideo, setFeaturedVideo] = useState<{ url?: string; title?: string; creator?: string; thumbnail?: string } | null>(null);
  const [siteSettings, setSiteSettings] = useState<{ heroPostIds?: string[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allPosts, testimonials, travellerData, settings] = await Promise.all([
          getAllPostsTyped(),
          getTestimonials(),
          getTravellers(),
          getSiteSettings(),
        ]);
        const publishedPosts = allPosts.filter((p) => p.status === 'published');
        setPosts(publishedPosts);
        setTestimonialsList(testimonials);
        setTravellersList(travellerData);
        setSiteSettings(settings);
        if (settings?.featuredVideoUrl) {
          setFeaturedVideo({
            url: settings.featuredVideoUrl,
            title: settings.featuredVideoTitle,
            creator: settings.featuredVideoCreator,
            thumbnail: settings.featuredVideoThumbnail,
          });
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const postsAsArticles = posts.map((post) => ({
    id: post.id,
    title: post.title,
    image: post.featuredImage || '',
    slug: post.slug,
    category: post.category,
    date: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase() : '',
    author: post.authorName,
    readTime: post.readTime,
    authorLocation: post.authorLocation,
    authorCity: post.authorCity,
    authorCountry: post.authorCountry,
  }));

  const heroPostIds = siteSettings?.heroPostIds || [];
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
  const foodDrinksArticles = postsAsArticles.filter((p) => p.category === 'food-drinks').slice(0, 3);
  const retreatsArticles = postsAsArticles.filter((p) => p.category === 'retreats').slice(0, 3);
  const wellnessArticles = postsAsArticles.filter((p) => p.category === 'wellness').slice(0, 3);
  const changeMakerArticles = postsAsArticles.filter((p) => p.category === 'changemaker').slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-1 w-full space-y-8 lg:space-y-12">
        {heroImages.length > 0 && <HeroCarousel images={heroImages} />}
        {!loading && latestArticles.length > 0 && <LatestArticles articles={latestArticles} />}
        {!loading && travelLivingArticles.length > 0 && <TravelLiving articles={travelLivingArticles} />}
        {!loading && adventureArticles.length > 0 && <AdventureWildlife articles={adventureArticles} />}
        {!loading && foodDrinksArticles.length > 0 && <FoodDrinks articles={foodDrinksArticles} />}
        {!loading && retreatsArticles.length > 0 && <Retreats articles={retreatsArticles} />}
        {!loading && wellnessArticles.length > 0 && <Wellness articles={wellnessArticles} />}
        {!loading && testimonialsList.length > 0 && <ChangeMaker testimonials={testimonialsList} featuredVideo={featuredVideo} />}
        {!loading && travellersList.length > 0 && <TravellerSection travellers={travellersList} />}
      </main>
      <Footer />
    </div>
  );
}
