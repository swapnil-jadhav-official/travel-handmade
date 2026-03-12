'use client';

import { useEffect, useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import type { Testimonial } from '@/types';

interface ChangeMakerProps {
  testimonials: Testimonial[];
}

const AUTO_ROTATE_INTERVAL = 5000;

export default function ChangeMaker({
  testimonials,
}: ChangeMakerProps): React.ReactElement {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, AUTO_ROTATE_INTERVAL);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const active = testimonials[activeIndex];

  return (
    <section className="w-full px-8 py-16">
      <SectionHeader title="Change Maker" className="mb-12" />

      <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
        {/* Testimonial */}
        <div className="flex-1">
          <blockquote className="border-l-4 border-black pl-6">
            <p className="mb-6 font-work-sans text-lg italic text-gray-800">
              "{active.quote}"
            </p>
            <footer className="font-unbounded font-light text-base text-black">
              — {active.author}
            </footer>
          </blockquote>
        </div>

        {/* Image */}
        <div className="relative flex-1">
          <div className="relative h-64 w-64 overflow-hidden rounded-lg">
            {testimonials.map((testimonial, index) => (
              <img
                key={testimonial.id}
                src={testimonial.image}
                alt={testimonial.author}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                  index === activeIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="mt-8 flex gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to testimonial ${index + 1}`}
            className={`transition-all duration-300 ${
              index === activeIndex
                ? 'h-2 w-8 bg-black'
                : 'h-2 w-2 bg-gray-300 hover:bg-gray-500'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
