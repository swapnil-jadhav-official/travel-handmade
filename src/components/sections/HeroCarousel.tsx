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
  images,
}: HeroCarouselProps): React.ReactElement {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, AUTO_ROTATE_INTERVAL);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative w-full overflow-hidden bg-gray-300">
      <div className="relative h-[600px]">
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
                <div className="font-unbounded font-medium text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] text-white text-center leading-[110%] tracking-[-0.02em] max-w-4xl mx-auto hover:text-white/80 transition-colors cursor-pointer">
                  {images[activeIndex].title}
                </div>
              </Link>
            ) : (
              <div className="font-unbounded font-medium text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] text-white text-center leading-[110%] tracking-[-0.02em] max-w-4xl mx-auto">
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
              className={`rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'h-3 w-3 bg-white'
                  : 'h-2 w-2 bg-white/50 hover:bg-white/75'
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
