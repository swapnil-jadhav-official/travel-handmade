'use client';

import { useEffect, useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import type { Testimonial } from '@/types';

interface ChangeMakerProps {
  testimonials: Testimonial[];
  featuredVideo?: { url?: string; title?: string; creator?: string; thumbnail?: string } | null;
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
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, AUTO_ROTATE_INTERVAL);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const active = testimonials[activeIndex];
  const embedUrl = featuredVideo?.url ? getYouTubeEmbedUrl(featuredVideo.url) : null;
  const hasThumbnail = featuredVideo?.thumbnail && embedUrl;

  return (
    <section className="w-full flex flex-col px-6 sm:px-8 lg:px-12 py-10 lg:py-12 lg:h-dvh">
      <SectionHeader title="Changemaker" className="section-header-gap" />

      <div className="flex-1 flex flex-col gap-10 lg:flex-row lg:gap-16">
        {/* Left: Video */}
        {featuredVideo?.url && embedUrl && (
          <div className="w-full lg:w-[35%] flex-shrink-0">
            <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] lg:aspect-auto lg:h-full overflow-hidden group cursor-pointer">
              {hasThumbnail && !isPlaying ? (
                <>
                  <img
                    src={featuredVideo.thumbnail}
                    alt={featuredVideo.title || 'Featured Video'}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
                  {/* Bottom-left: outline play + title + creator */}
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute bottom-0 left-0 right-0 px-5 py-5 text-left hover:opacity-90 transition cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      {/* Outline circle play button */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-white flex items-center justify-center">
                        <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      {/* Title + Creator stacked */}
                      <div className="flex flex-col gap-3">
                        {featuredVideo.title && (
                          <p className="heading-article-title text-white" style={{ fontFamily: 'var(--font-unbounded)', fontWeight: 400 }}>
                            {featuredVideo.title}
                          </p>
                        )}
                        {featuredVideo.creator && (
                          <p className="text-subcategory text-white/80">
                            {featuredVideo.creator}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                </>
              ) : (
                <iframe
                  className="absolute inset-0 w-full h-full border-0"
                  src={isPlaying || !hasThumbnail ? embedUrl : undefined}
                  title={featuredVideo.title || 'Featured Video'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        )}

        {/* Right: Quote Card */}
        <div className="relative w-full lg:flex-1 overflow-hidden h-72 sm:h-96 lg:h-auto bg-black">
          {/* Dark gray background */}
          <div className="absolute inset-0 w-[55%] sm:w-[60%] lg:w-[65%] bg-[#2f2f2f]" />

          {/* Quote icon pinned to top */}
          <span
            className="absolute top-2 sm:top-4 lg:top-6 left-4 sm:left-6 lg:left-14 text-[48px] sm:text-[64px] lg:text-[96px] leading-none tracking-[2.88px] text-white pointer-events-none select-none"
            style={{ fontFamily: 'var(--font-unbounded)' }}
          >
            &rdquo;
          </span>

          {/* Quote text — top, just below the quote mark */}
          <p
            className="absolute left-4 sm:left-6 lg:left-14 top-12 sm:top-16 lg:top-24 w-[34%] sm:w-[40%] lg:w-60 font-medium text-[13px] sm:text-[18px] lg:text-[28px] leading-[110%] tracking-[0.96px] text-white"
            style={{ fontFamily: 'var(--font-unbounded)' }}
          >
            {active.quote}
          </p>

          {/* Author + article — pinned to bottom */}
          <footer className="absolute bottom-0 left-4 sm:left-6 lg:left-14 pb-5 sm:pb-6 lg:pb-8 w-[48%] sm:w-[54%] lg:w-80 text-subcategory text-white">
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

          {/* Rotating Image */}
          <div className="absolute top-0 right-0 w-[45%] sm:w-[40%] lg:w-[35%] h-full overflow-hidden">
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
