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
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between mb-8 sm:mb-10 md:mb-12 border-b border-black pb-2 sm:pb-3">
        <div className="font-unbounded font-light text-lg sm:text-xl md:text-2xl lg:text-3xl uppercase tracking-wide text-black">
          Wellness
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
      <div className="flex gap-4 sm:gap-6 md:gap-8 flex-col sm:flex-row">
        {visibleArticles.map((article, idx) => (
          <Link
            key={`${article.id}-${idx}`}
            href={`/blog/${article.slug}`}
            className={`${idx === 0 ? "sm:flex-[2]" : "sm:flex-1"} flex-1`}
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
                {/* Author and Reading Time */}
                <p className="text-xs font-semibold text-white/90 uppercase tracking-wider mb-2 sm:mb-3 md:mb-4 line-clamp-1">
                  {article.category?.replace(/-/g, " + ").toUpperCase()} |{" "}
                  {article.date}
                </p>

                {/* Title */}
                <div className="font-unbounded font-semibold text-lg sm:text-xl md:text-2xl text-white leading-tight line-clamp-3">
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
