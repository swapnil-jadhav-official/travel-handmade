'use client';

import { useEffect, useState } from 'react';
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
          <img
            key={image.id}
            src={image.image}
            alt={image.title}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70 z-5" />

        {/* Title Overlay */}
        {images[activeIndex] && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 px-4 w-full">
            <div className="font-unbounded font-medium text-[32px] text-white text-center leading-[110%] tracking-[-0.02em] max-w-4xl mx-auto">
              {images[activeIndex].title}
            </div>
          </div>
        )}

        {/* Dot Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`transition-all duration-300 ${
                index === activeIndex
                  ? 'h-2 w-8 bg-white'
                  : 'h-2 w-2 bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
