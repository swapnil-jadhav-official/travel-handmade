'use client';

import { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
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
  const videoTestimonial = testimonials.find((t) => t.videoUrl);

  return (
    <section className="w-full px-8 py-16">
      <SectionHeader title="Change Maker" className="mb-12" />

      <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
        {/* Left: Video Section (Fixed) - 35% - Exact Figma Replica */}
        {videoTestimonial && (
          <div className="relative w-[371px] h-[483px] mx-auto lg:w-[35%] lg:h-[483px] lg:max-w-none overflow-hidden">
            {/* Video */}
            <video
              className="absolute w-[419.21px] h-[551.24px] top-[-23.58px] left-[-3.31px] object-cover"
              autoPlay
              loop
              muted
            >
              <source src={videoTestimonial.videoUrl} type="video/mp4" />
            </video>

            {/* Title - Positioned absolutely at bottom left */}
            <div className="absolute top-[402px] left-[74px] w-[249px] h-[34px]">
              <h3 className="font-unbounded font-medium text-base text-white leading-[18px] tracking-[0.48px]">
                {videoTestimonial.videoTitle}
              </h3>
            </div>

            {/* Subtitle - Positioned absolutely */}
            {videoTestimonial.videoSubtitle && (
              <div className="absolute top-[438px] left-[74px] w-[249px] h-[17px] flex items-center justify-center">
                <p className="font-work-sans text-[9px] text-white leading-[10px] tracking-[0.27px]">
                  {videoTestimonial.videoSubtitle}
                </p>
              </div>
            )}

            {/* Play Button - Positioned absolutely at bottom left */}
            <div className="absolute top-[401px] left-[17px]">
              <div className="w-[45px] h-[45px] rounded-full bg-white flex items-center justify-center">
                <Play className="w-5 h-5 text-black fill-black" />
              </div>
            </div>
          </div>
        )}

        {/* Right: Quote Card (Rotating) - Exact Figma Replica */}
        <div className="relative lg:w-[65%] overflow-hidden h-[483px] bg-black">
          {/* Dark Gray Background (65% width) */}
          <div className="absolute inset-0 w-[65%] bg-[#2f2f2f]" />

          {/* Quote Content - Centered vertically */}
          <blockquote className="absolute top-1/2 left-14 transform -translate-y-1/2 w-80 text-white">
            {/* Quotation Mark */}
            <span className="font-unbounded text-[96px] leading-none tracking-[2.88px] block">
              &rdquo;
            </span>

            {/* Quote Text */}
            <p className="font-unbounded font-medium text-[32px] leading-[110%] tracking-[0.96px] mt-0">
              {active.quote}
            </p>

            {/* Author */}
            <footer className="font-work-sans text-[10px] leading-[11px] tracking-[0.3px] mt-5 uppercase">
              {active.articleTitle} | {active.author}
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
