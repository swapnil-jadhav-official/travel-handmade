"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Article } from "@/types";

interface WellnessProps {
  articles: Article[];
}

export default function Wellness({
  articles,
}: WellnessProps): React.ReactElement {
  const visibleArticles = articles.slice(0, 2);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? visibleArticles.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % visibleArticles.length);
  };

  return (
    <section className="w-full py-10 sm:py-12 lg:py-16">
      {/* Header */}
      <div className="px-6 sm:px-8 lg:px-12 section-header-gap">
        {/* Mobile: header with arrows */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-300 sm:hidden">
          <div className="heading-main-category">Wellness</div>
          <div className="flex gap-1">
            <button onClick={handlePrevious} className="p-1 hover:bg-black/10 rounded transition" aria-label="Previous">
              <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <button onClick={handleNext} className="p-1 hover:bg-black/10 rounded transition" aria-label="Next">
              <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
        {/* Desktop: plain header */}
        <div className="hidden sm:block heading-main-category pb-3 border-b border-gray-300">
          Wellness
        </div>
      </div>

      {/* Mobile: single card carousel */}
      <div className="sm:hidden px-6">
        <Link href={`/blog/${visibleArticles[currentIndex].slug}`}>
          <div className="relative overflow-hidden bg-gray-300 cursor-pointer group aspect-[4/3]">
            <Image
              src={visibleArticles[currentIndex].image}
              alt={visibleArticles[currentIndex].title}
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70" />
            <div className="absolute inset-0 flex flex-col justify-end items-start px-6 pb-6">
              <div className="heading-post-title text-white max-w-xs">
                {visibleArticles[currentIndex].title}
              </div>
              {(visibleArticles[currentIndex].author || visibleArticles[currentIndex].readTime) && (
                <p className="text-subcategory text-white/90 mt-4">
                  {visibleArticles[currentIndex].author}
                  {visibleArticles[currentIndex].author && visibleArticles[currentIndex].readTime && " | "}
                  {visibleArticles[currentIndex].readTime}
                </p>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* Desktop: original side-by-side layout */}
      <div className="hidden sm:flex gap-8 lg:gap-12 sm:px-8 lg:px-0">
        {visibleArticles.map((article, idx) => (
          <Link
            key={`${article.id}-${idx}`}
            href={`/blog/${article.slug}`}
            className={idx === 0 ? "flex-[2]" : "flex-1"}
          >
            <div className={`relative overflow-hidden bg-gray-300 cursor-pointer group ${idx === 0 ? "aspect-[826/484]" : "aspect-[413/484]"}`}>
              <Image
                src={article.image}
                alt={article.title}
                fill
                sizes={idx === 0 ? "(min-width: 640px) 66vw, 100vw" : "(min-width: 640px) 33vw, 100vw"}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70" />
              <div className="absolute inset-0 flex flex-col justify-end items-start px-6 sm:px-8 pb-6 sm:pb-8">
                <div className="heading-post-title text-white max-w-xs sm:max-w-sm md:max-w-md">
                  {article.title}
                </div>
                {(article.author || article.readTime) && (
                  <p className="text-subcategory text-white/90 mt-4 sm:mt-5">
                    {article.author}
                    {article.author && article.readTime && " | "}
                    {article.readTime}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
