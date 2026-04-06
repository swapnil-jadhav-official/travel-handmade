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
    <section className="w-full flex flex-col py-10 lg:py-12 lg:h-dvh">
      {/* Header with Navigation */}
      <div className="px-6 sm:px-8 lg:px-12 section-header-gap">
        <div className="flex items-center justify-between pb-3 border-b border-black">
          <div className="heading-main-category">Travel + Living</div>
          <div className="flex gap-2 sm:gap-4">
            <button
              onClick={handlePrevious}
              className="p-1.5 sm:p-2 hover:bg-black/10 rounded transition text-black"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 sm:p-2 hover:bg-black/10 rounded transition text-black"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 flex gap-4 sm:gap-8 lg:gap-12 px-6 sm:px-8 lg:px-0">
        {visibleArticles.map((article, idx) => (
          <Link
            key={`${article.id}-${idx}`}
            href={`/blog/${article.slug}`}
            className={idx === 0 ? "hidden sm:block flex-[2]" : "flex-1"}
          >
            <div className="relative overflow-hidden bg-gray-300 cursor-pointer group h-64 sm:h-80 lg:h-full">
              <Image
                src={article.image}
                alt={article.title}
                fill
                sizes={idx === 0 ? "(min-width: 1024px) 66vw, (min-width: 640px) 66vw, 0px" : "(min-width: 640px) 33vw, 100vw"}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70" />
              <div className="absolute inset-0 flex flex-col justify-center items-start px-6 sm:px-8 pb-6 sm:pb-8 pt-56">
                <div className="heading-post-title text-white line-clamp-3 max-w-xs sm:max-w-sm md:max-w-md">
                  {article.title}
                </div>
                {(article.author || article.readTime) && (
                  <p className="text-subcategory text-white/90 mt-4 sm:mt-5 line-clamp-1">
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
