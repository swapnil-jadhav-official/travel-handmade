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

  if (!currentArticle) return <section className="w-full h-dvh" />;

  return (
    <section className="w-full">
      <Link href={`/blog/${currentArticle.slug}`}>
        <div className="group relative overflow-hidden bg-gray-300 cursor-pointer h-dvh">
          {/* Background Image */}
          <Image
            src={currentArticle.image}
            alt={currentArticle.title}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-between px-6 sm:px-8 lg:px-12 py-10 lg:py-12">
            {/* Section Header */}
            <div className="heading-main-category-dark border-b border-white pb-3">
              Adventure + Wildlife
            </div>

            {/* Article Content */}
            <div className="mb-16 lg:mb-20">
              <div className="heading-post-title text-white mb-2 sm:mb-3 line-clamp-3 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                {currentArticle.title}
              </div>
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
