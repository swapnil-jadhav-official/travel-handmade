'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Article } from '@/types';

interface HoverImageListProps {
  articles: Article[];
  imagePosition: 'left' | 'right';
  showMeta?: boolean;
}

export default function HoverImageList({
  articles,
  imagePosition,
  showMeta = false,
}: HoverImageListProps): React.ReactElement {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeArticle = articles[activeIndex];

  return (
    <div
      className={`flex flex-col gap-8 lg:flex-row ${
        imagePosition === 'left' ? 'lg:flex-row-reverse' : ''
      }`}
    >
      {/* Article List */}
      <div className="flex-1">
        <div className="space-y-0">
          {articles.map((article, index) => (
            <Link key={article.id} href={`/blog/${article.slug}`}>
              <div
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                role="button"
                tabIndex={0}
                className="group cursor-pointer border-b border-black py-5 transition-colors duration-200"
              >
                {/* Metadata (optional) */}
                {showMeta && (
                  <p className="mb-2 font-work-sans text-xs text-gray-600">
                    {article.category} | {article.date}
                  </p>
                )}

                {/* Title */}
                <h3 className="font-unbounded font-medium text-base text-black transition-all duration-200 group-hover:underline">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Image Container */}
      <div className="w-full lg:w-[40%]">
        {activeArticle && (
          <Link href={`/blog/${activeArticle.slug}`}>
            <div className="relative overflow-hidden bg-gray-200 cursor-pointer group">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="h-96 w-full object-cover transition-all duration-500 group-hover:scale-105"
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
