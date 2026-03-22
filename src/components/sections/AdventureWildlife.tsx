"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types";

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

  if (!currentArticle) return <section className="w-full py-12 sm:py-16 md:py-20" />;

  return (
    <section className="w-full py-12 sm:py-16 md:py-20">
      {/* Featured Card */}
      <Link href={`/blog/${currentArticle.slug}`}>
        <div className="group relative overflow-hidden bg-gray-300 cursor-pointer h-64 sm:h-80 md:h-96 lg:h-125">
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
          <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 md:p-8">
            {/* Section Header at Top */}
            <div className="px-4 sm:px-6 md:px-8 lg:px-12">
              <div className="heading-main-category-dark border-b border-white pb-1">
                Adventure + Wildlife
              </div>
            </div>

            {/* Article Content at Bottom */}
            <div>
              {/* Title */}
              <div className="heading-post-title text-white mb-2 sm:mb-3 md:mb-4 line-clamp-3 max-w-xs sm:max-w-sm md:max-w-md">
                {currentArticle.title}
              </div>

              {/* Author and Read Time */}
              {(currentArticle.author || currentArticle.readTime) && (
                <p className="text-subcategory text-white/90 line-clamp-1">
                  {currentArticle.author}
                  {currentArticle.author && currentArticle.readTime && " | "}
                  {currentArticle.readTime}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
