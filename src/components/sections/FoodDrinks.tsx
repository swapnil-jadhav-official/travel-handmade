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
    <section className="w-full px-8 py-16">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between mb-12 border-b border-black pb-2">
        <div className="font-unbounded font-light text-3xl uppercase tracking-wide text-black">
          Food + Drinks
        </div>
        <div className="flex gap-4">
          <button
            onClick={handlePrevious}
            className="p-2 hover:bg-black/10 rounded transition"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 hover:bg-black/10 rounded transition"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Carousel Cards - 3 at a time */}
      <div className="grid grid-cols-3 gap-8">
        {[0, 1, 2].map((offset) => {
          const index = (currentIndex + offset) % articles.length;
          const article = articles[index];
          return (
            <Link
              key={`${article.id}-${offset}`}
              href={`/blog/${article.slug}`}
            >
              <div className="relative overflow-hidden bg-gray-300 cursor-pointer group h-96">
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
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  {/* Author and Reading Time */}
                  <p className="text-xs font-semibold text-white/90 uppercase tracking-wider mb-4">
                    {article.category?.replace(/-/g, " + ").toUpperCase()} |{" "}
                    {article.date}
                  </p>

                  {/* Title */}
                  <div className="font-unbounded font-bold text-2xl text-white leading-tight">
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
