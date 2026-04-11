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
    <section className="w-full py-10 sm:py-12 lg:py-16">
      {/* Header */}
      <div className="px-6 sm:px-8 lg:px-12 section-header-gap">
        <div className="heading-main-category pb-3 border-b border-black">
          Wellness
        </div>
      </div>

      {/* Cards */}
      <div className="flex gap-4 sm:gap-8 lg:gap-12 flex-col sm:flex-row">
        {visibleArticles.map((article, idx) => (
          <Link
            key={`${article.id}-${idx}`}
            href={`/blog/${article.slug}`}
            className={`${idx === 0 ? "sm:flex-[2]" : "sm:flex-1"} flex-1`}
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
              <div className="absolute inset-0 flex flex-col justify-center items-start px-6 sm:px-8 pb-6 sm:pb-8 pt-56">
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
