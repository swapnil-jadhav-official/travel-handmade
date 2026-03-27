'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { HeroImage } from '@/types';

interface HeroCarouselProps {
  images: HeroImage[];
}

const AUTO_ROTATE_INTERVAL = 5000;

export default function HeroCarousel({
  images: rawImages,
}: HeroCarouselProps): React.ReactElement {
  // Limit to max 3 images
  const images = rawImages.slice(0, 3);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, AUTO_ROTATE_INTERVAL);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative w-full overflow-hidden bg-gray-300">
      <div className="relative w-full h-[calc(100dvh-67px)]">
        {/* Images */}
        {images.map((image, index) => (
          <Image
            key={image.id}
            src={image.image}
            alt={image.title}
            fill
            className={`object-cover transition-opacity duration-700 ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
            priority={index === 0}
          />
        ))}

        {/* Gradient Overlay - Dark at bottom, transparent at top */}
        <div className="absolute inset-0 z-5" style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.7) 100%)'
        }} />

        {/* Title Overlay */}
        {images[activeIndex] && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 px-4 w-full">
            {images[activeIndex].link ? (
              <Link href={`/blog/${images[activeIndex].link}`}>
                <div className="heading-post-title text-white text-center max-w-5xl mx-auto line-clamp-3 hover:text-white/80 transition-colors cursor-pointer">
                  {images[activeIndex].title}
                </div>
              </Link>
            ) : (
              <div className="heading-post-title text-white text-center max-w-5xl mx-auto line-clamp-3">
                {images[activeIndex].title}
              </div>
            )}
          </div>
        )}

        {/* Left Arrow - Middle */}
        <button
          onClick={() => setActiveIndex((prev) => (prev - 1 + images.length) % images.length)}
          aria-label="Previous slide"
          className="absolute left-6 top-1/2 -translate-y-1/2 z-10 text-white hover:text-white/80 transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>

        {/* Dot Indicators - Bottom Center */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'bg-white'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>

        {/* Right Arrow - Middle */}
        <button
          onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
          aria-label="Next slide"
          className="absolute right-6 top-1/2 -translate-y-1/2 z-10 text-white hover:text-white/80 transition-colors cursor-pointer"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>
    </section>
  );
}
