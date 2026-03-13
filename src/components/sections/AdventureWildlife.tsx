'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/types';

interface AdventureWildlifeProps {
  articles: Article[];
}

const AUTO_ROTATE_INTERVAL = 5000;

export default function AdventureWildlife({
  articles,
}: AdventureWildlifeProps): React.ReactElement {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (articles.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, AUTO_ROTATE_INTERVAL);

    return () => clearInterval(interval);
  }, [articles.length]);

  const currentArticle = articles[currentIndex];

  if (!currentArticle) return <section className="w-full px-8 py-16" />;

  return (
    <section className="w-full px-8 py-16">
      {/* Featured Card */}
      <Link href={`/blog/${currentArticle.slug}`}>
        <div className="group relative overflow-hidden bg-gray-300 cursor-pointer h-[500px]">
          {/* Background Image */}
          <Image
            src={currentArticle.image}
            alt={currentArticle.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-between p-8">
            {/* Section Header at Top */}
            <h2 className="font-unbounded font-light text-3xl uppercase tracking-wide text-white border-b border-white pb-2">
              Adventure + Wildlife
            </h2>

            {/* Article Content at Bottom */}
            <div>
              {/* Metadata */}
              <p className="text-xs font-semibold text-white/90 uppercase tracking-wider mb-4">
                {currentArticle.category?.replace(/-/g, ' + ').toUpperCase()} | {currentArticle.date}
              </p>

              {/* Title */}
              <h3 className="font-unbounded font-bold text-2xl text-white leading-tight">
                {currentArticle.title}
              </h3>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
