'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  const isBlackBg = index % 2 === 0;

  return (
    <div className={`group h-full flex flex-col overflow-hidden ${className}`}>
      {/* Image */}
      <div
        className="relative flex-1 min-h-[50vh] md:min-h-[45vh] lg:min-h-0 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={traveller.image}
          alt={traveller.country}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Overlay on Hover */}
        {isHovered && traveller.articleName && (
          <div className="absolute inset-0 bg-black/60 flex items-end justify-center pb-6 lg:pb-8">
            {traveller.articleUrl ? (
              <Link href={traveller.articleUrl} className="heading-article-title text-white text-center max-w-[8rem] mx-auto hover:opacity-75 transition-opacity">
                {traveller.articleName}
              </Link>
            ) : (
              <div className="heading-article-title text-white text-center max-w-[8rem] mx-auto">
                {traveller.articleName}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className={`px-6 py-8 flex-shrink-0 ${isBlackBg ? 'bg-black' : 'bg-white border border-gray-200'}`}>
        <div className={`heading-location text-center ${isBlackBg ? 'text-white' : 'text-black'}`}>
          {traveller.country}
        </div>
        <p className={`text-subcategory text-center mt-2 ${isBlackBg ? 'text-white' : 'text-black'}`}>
          {traveller.traveller_name}
        </p>
      </div>
    </div>
  );
}
