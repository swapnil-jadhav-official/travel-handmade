'use client';

import { useEffect, useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import type { Testimonial } from '@/types';

interface ChangeMakerProps {
  testimonials: Testimonial[];
  featuredVideo?: { url?: string; title?: string; creator?: string } | null;
}

const AUTO_ROTATE_INTERVAL = 5000;

function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/);
  return match?.[1] || null;
}

function getYouTubeEmbedUrl(url: string): string | null {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
}

export default function ChangeMaker({
  testimonials,
  featuredVideo,
}: ChangeMakerProps): React.ReactElement {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, AUTO_ROTATE_INTERVAL);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const active = testimonials[activeIndex];
  const embedUrl = featuredVideo?.url ? getYouTubeEmbedUrl(featuredVideo.url) : null;

  return (
    <section className="w-full px-6 sm:px-8 lg:px-12 py-12 sm:py-16 md:py-20">
      <SectionHeader title="Change Maker" className="mb-10 sm:mb-12 md:mb-16" />

      <div className="flex flex-col gap-10 lg:flex-row lg:gap-16 lg:items-stretch">
        {/* Left: Video */}
        {featuredVideo?.url && embedUrl && (
          <div className="w-full lg:w-[35%] flex-shrink-0 flex flex-col gap-3">
            <div className="relative w-full aspect-video lg:aspect-auto lg:flex-1 overflow-hidden">
              <iframe
                className="absolute inset-0 w-full h-full border-0"
                src={embedUrl}
                title={featuredVideo.title || 'Featured Video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {featuredVideo.title && (
              <div className="heading-article-title text-black">
                {featuredVideo.title}
              </div>
            )}
            {featuredVideo.creator && (
              <p className="text-subcategory text-black/60">
                {featuredVideo.creator}
              </p>
            )}
          </div>
        )}

        {/* Right: Quote Card */}
        <div className="relative w-full lg:flex-1 overflow-hidden h-72 sm:h-96 lg:h-auto lg:min-h-[420px] bg-black">
          {/* Dark gray background (65% width) */}
          <div className="absolute inset-0 w-[65%] bg-[#2f2f2f]" />

          {/* Quote Content */}
          <blockquote className="absolute top-1/2 left-4 sm:left-6 lg:left-14 -translate-y-1/2 w-52 sm:w-64 lg:w-80 text-white">
            <span className="font-unbounded text-[48px] sm:text-[64px] lg:text-[96px] leading-none tracking-[2.88px] block">
              &rdquo;
            </span>
            <p className="font-unbounded font-medium text-[16px] sm:text-[22px] lg:text-[32px] leading-[110%] tracking-[0.96px] mt-0">
              {active.quote}
            </p>
            <footer className="font-work-sans text-[7px] sm:text-[8px] lg:text-[10px] leading-[11px] tracking-[0.3px] mt-5 uppercase">
              {active.articleTitle && active.articleUrl ? (
                <>
                  <a
                    href={active.articleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition"
                  >
                    {active.articleTitle}
                  </a>
                  {' | '}
                </>
              ) : null}
              {active.author}
            </footer>
          </blockquote>

          {/* Rotating Image */}
          <div className="absolute top-0 right-0 w-[35%] h-full overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <img
                key={testimonial.id}
                src={testimonial.image}
                alt={testimonial.author}
                loading="eager"
                className={`absolute top-0 left-0 h-full w-full object-cover transition-opacity duration-700 ${
                  index === activeIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
