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

  // Handle youtube.com/watch?v=
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/);
  return match?.[1] || null;
}

function getYouTubeEmbedUrl(url: string): string | null {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;
  // Embed parameters:
  // rel=0 - Disable related videos
  // modestbranding=1 - Hide YouTube logo
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
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20">
      <SectionHeader title="Change Maker" className="mb-10 sm:mb-12 md:mb-16" />

      <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
        {/* Left: Video Section (Fixed) - 35% - Exact Figma Replica */}
        {featuredVideo?.url && embedUrl && (
          <div className="relative w-[250px] h-80 sm:w-[300px] sm:h-96 md:w-[340px] md:h-96 mx-auto lg:w-[35%] lg:h-[483px] lg:max-w-none overflow-hidden">
            {/* Video - YouTube Embed */}
            <iframe
              className="absolute w-full h-full top-0 left-0 border-0"
              src={embedUrl}
              title={featuredVideo.title || 'Featured Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />

            {/* Title - Positioned absolutely at bottom left */}
            {featuredVideo.title && (
              <div className="absolute top-[402px] left-[74px] w-[249px] h-[34px]">
                <div className="font-unbounded font-medium text-base text-white leading-[18px] tracking-[0.48px]">
                  {featuredVideo.title}
                </div>
              </div>
            )}

            {/* Creator Name - Positioned absolutely */}
            {featuredVideo.creator && (
              <div className="absolute top-[438px] left-[74px] w-[249px] h-[17px] flex items-center justify-center">
                <p className="font-work-sans text-[9px] text-white leading-[10px] tracking-[0.27px]">
                  {featuredVideo.creator}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Right: Quote Card (Rotating) - Exact Figma Replica */}
        <div className="relative w-full sm:w-full md:w-full lg:w-[65%] overflow-hidden h-80 sm:h-96 md:h-96 lg:h-[483px] bg-black">
          {/* Dark Gray Background (65% width) */}
          <div className="absolute inset-0 w-[65%] bg-[#2f2f2f]" />

          {/* Quote Content - Centered vertically */}
          <blockquote className="absolute top-1/2 left-4 sm:left-6 md:left-8 lg:left-14 transform -translate-y-1/2 w-52 sm:w-64 md:w-72 lg:w-80 text-white">
            {/* Quotation Mark */}
            <span className="font-unbounded text-[48px] sm:text-[64px] md:text-[80px] lg:text-[96px] leading-none tracking-[2.88px] block">
              &rdquo;
            </span>

            {/* Quote Text */}
            <p className="font-unbounded font-medium text-[16px] sm:text-[20px] md:text-[26px] lg:text-[32px] leading-[110%] tracking-[0.96px] mt-0">
              {active.quote}
            </p>

            {/* Author & Article */}
            <footer className="font-work-sans text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] leading-[11px] tracking-[0.3px] mt-5 uppercase">
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

          {/* Rotating Image - 35% width, right side */}
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
