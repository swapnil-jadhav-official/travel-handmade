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
    <section className="w-full flex flex-col py-10 lg:py-12 lg:h-dvh">
      {/* Header with Navigation */}
      <div className="section-header-gap px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between border-b border-black pb-3">
          <div className="heading-main-category">Food + Drinks</div>
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

      {/* Cards — 1 on mobile, 3 on desktop */}
      <div className="flex-1 px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 lg:gap-12">
        {[0, 1, 2].map((offset) => {
          const index = (currentIndex + offset) % articles.length;
          const article = articles[index];
          return (
            <Link
              key={`${article.id}-${offset}`}
              href={`/blog/${article.slug}`}
              className={offset > 0 ? "hidden lg:block" : ""}
            >
              <div className="relative overflow-hidden bg-gray-300 cursor-pointer group h-72 sm:h-96 lg:h-full">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-8 pb-6 sm:pb-8 pt-80">
                  <div className="heading-article-title text-white line-clamp-4 max-w-[20rem]">
                    {article.title}
                  </div>
                  {(article.author || article.readTime) && (
                    <p className="text-subcategory text-white/80 mt-5 line-clamp-1">
                      {article.author}
                      {article.author && article.readTime && " | "}
                      {article.readTime}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
