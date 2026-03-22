"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    <section className="w-full h-screen flex flex-col py-8 sm:py-10 md:py-12">
      {/* Header with Navigation */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 mb-6 sm:mb-8 md:mb-10">
        <div className="flex items-center justify-between pb-1 border-b border-black">
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
      </div>

      {/* Carousel Cards */}
      <div className="flex-1 flex gap-4 sm:gap-6 md:gap-8">
        {visibleArticles.map((article, idx) => (
          <Link
            key={`${article.id}-${idx}`}
            href={`/blog/${article.slug}`}
            className={`${idx === 0 ? "hidden sm:block flex-[2]" : "flex-1"}`}
          >
            <div className={`relative overflow-hidden bg-gray-300 cursor-pointer group ${idx === 0 ? "aspect-826/484" : "aspect-413/484"}`}>
              {/* Background Image */}
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-300"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-8">
                {/* Title */}
                <div className="heading-post-title text-white line-clamp-3 max-w-xs sm:max-w-sm md:max-w-md">
                  {article.title}
                </div>

                {/* Author and Read Time */}
                {(article.author || article.readTime) && (
                  <p className="text-subcategory text-white/90 mt-2 sm:mt-3 md:mt-4 line-clamp-1">
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
