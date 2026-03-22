"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Article } from "@/types";

interface FoodDrinksProps {
  articles: Article[];
}

export default function FoodDrinks({
  articles,
}: FoodDrinksProps): React.ReactElement {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? articles.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  };

  return (
    <section className="w-full min-h-screen flex flex-col py-12 sm:py-16 md:py-20">
      {/* Header with Navigation */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 mb-10 sm:mb-12 md:mb-16 border-b border-black pb-2 sm:pb-3">
        <div className="flex items-center justify-between">
          <div className="heading-main-category">
            Food + Drinks
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

      {/* Carousel Cards - 1 on mobile, 2 on tablet, 3 on desktop */}
      <div className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {[0, 1, 2].map((offset) => {
          const index = (currentIndex + offset) % articles.length;
          const article = articles[index];
          return (
            <Link
              key={`${article.id}-${offset}`}
              href={`/blog/${article.slug}`}
            >
              <div className="relative overflow-hidden bg-gray-300 cursor-pointer group h-screen">
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
                  <p className="text-subcategory text-white/90 mb-3 sm:mb-4 line-clamp-1">
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
          );
        })}
      </div>
    </section>
  );
}
