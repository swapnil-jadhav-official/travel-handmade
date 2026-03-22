"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import type { Article } from "@/types";

interface TravelLivingProps {
  articles: Article[];
}

export default function TravelLiving({
  articles,
}: TravelLivingProps): React.ReactElement {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? articles.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === articles.length - 1 ? 0 : prev + 1));
  };

  const visibleArticles = [
    articles[currentIndex],
    articles[(currentIndex + 1) % articles.length],
  ];

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between mb-10 sm:mb-12 md:mb-16 border-b border-black pb-2 sm:pb-3">
        <div className="heading-main-category">
          Travel + Living
        </div>
        <div className="flex gap-2 sm:gap-4">
          <button
            onClick={handlePrevious}
            className="p-1.5 sm:p-2 hover:bg-black/10 rounded transition"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 sm:p-2 hover:bg-black/10 rounded transition"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      {/* Carousel Cards */}
      <div className="flex gap-4 sm:gap-6 md:gap-8">
        {visibleArticles.map((article, idx) => (
          <Link
            key={`${article.id}-${idx}`}
            href={`/blog/${article.slug}`}
            className={`${idx === 0 ? "hidden sm:block flex-[2]" : "flex-1"}`}
          >
            <div className="relative overflow-hidden bg-gray-300 cursor-pointer group h-64 sm:h-80 md:h-96">
              {/* Background Image */}
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-8">
                {/* Category */}
                <p className="text-subcategory text-white/90 mb-2 sm:mb-3 md:mb-4 line-clamp-1">
                  {article.category?.replace(/-/g, " + ").toUpperCase()} |{" "}
                  {article.date}
                </p>

                {/* Title */}
                <div className="heading-post-title text-white line-clamp-3 max-w-xs sm:max-w-sm md:max-w-md">
                  {article.title}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
