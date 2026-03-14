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
import { getAllPostsTyped } from '@/lib/firestore';
import { testimonials, travellers, heroImages as defaultHeroImages } from '@/data/mockData';
import type { Post } from '@/types';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await getAllPostsTyped();
        // Filter only published posts
        const publishedPosts = allPosts.filter((p) => p.status === 'published');
        setPosts(publishedPosts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Convert Post to Article format (map featuredImage to image)
  const postsAsArticles = posts.map((post) => ({
    id: post.id,
    title: post.title,
    image: post.featuredImage || '',
    slug: post.slug,
    category: post.category,
    date: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase() : '',
    author: post.author,
    authorLocation: post.authorLocation,
    authorCity: post.authorCity,
    authorCountry: post.authorCountry,
  }));

  // Create hero images from latest posts with featured images
  const heroImages = posts
    .filter((p) => p.featuredImage)
    .slice(0, 5)
    .map((post) => ({
      id: post.id,
      image: post.featuredImage!,
      title: post.title,
    }));

  // Organize posts by category
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
      <main className="flex-1 w-full">
        {/* Hero Carousel */}
        <HeroCarousel images={heroImages.length > 0 ? heroImages : defaultHeroImages} />

        {/* Latest Articles */}
        {!loading && latestArticles.length > 0 && <LatestArticles articles={latestArticles} />}

        {/* Travel + Living */}
        {!loading && travelLivingArticles.length > 0 && <TravelLiving articles={travelLivingArticles} />}

        {/* Adventure + Wildlife */}
        {!loading && adventureArticles.length > 0 && <AdventureWildlife articles={adventureArticles} />}

        {/* Food + Drinks */}
        {!loading && foodDrinksArticles.length > 0 && <FoodDrinks articles={foodDrinksArticles} />}

        {/* Retreats */}
        {!loading && retreatsArticles.length > 0 && <Retreats articles={retreatsArticles} />}

        {/* Wellness */}
        {!loading && wellnessArticles.length > 0 && <Wellness articles={wellnessArticles} />}

        {/* Change Maker */}
        <ChangeMaker testimonials={testimonials} />

        {/* Traveller */}
        <TravellerSection travellers={travellers} />
      </main>
      <Footer />
    </div>
  );
}
