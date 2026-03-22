"use client";

import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types";

interface WellnessProps {
  articles: Article[];
}

export default function Wellness({
  articles,
}: WellnessProps): React.ReactElement {
  const visibleArticles = articles.slice(0, 2);

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20">
      {/* Header */}
      <div className="mb-14 sm:mb-16 md:mb-20 border-b border-black pb-2 sm:pb-3">
        <div className="heading-main-category">
          Wellness
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
        ))}
      </div>
    </section>
  );
}
