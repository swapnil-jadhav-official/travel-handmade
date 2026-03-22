'use client';

import { useState } from 'react';
import type { Traveller } from '@/types';

interface ProfileCardProps {
  traveller: Traveller;
  index?: number;
  className?: string;
}

export default function ProfileCard({
  traveller,
  index = 0,
  className = '',
}: ProfileCardProps): React.ReactElement {
  const [isHovered, setIsHovered] = useState(false);
  // Alternate between black and white backgrounds (even indices = black, odd = white)
  const isBlackBg = index % 2 === 0;

  return (
    <div className={`group overflow-hidden ${className}`}>
      {/* Image */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={traveller.image}
          alt={traveller.country}
          className="h-[480px] w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Overlay on Hover */}
        {isHovered && traveller.articleName && (
          <div className="absolute inset-0 bg-black/60 flex items-end justify-center">
            <div className="heading-article-title text-white text-center line-clamp-3 px-8 sm:px-10 md:px-12 py-4 sm:py-6 md:py-8">
              {traveller.articleName}
            </div>
          </div>
        )}
      </div>

      {/* Info Section with Alternating Background */}
      <div className={`px-6 py-8 ${isBlackBg ? 'bg-black' : 'bg-white border border-gray-200'}`}>
        {/* Location/Country */}
        <div className={`heading-location text-center ${isBlackBg ? 'text-white' : 'text-black'}`}>
          {traveller.country}
        </div>

        {/* Traveller Name */}
        <p className={`text-subcategory text-center mt-2 ${isBlackBg ? 'text-white' : 'text-black'}`}>
          {traveller.traveller_name}
        </p>
      </div>
    </div>
  );
}
