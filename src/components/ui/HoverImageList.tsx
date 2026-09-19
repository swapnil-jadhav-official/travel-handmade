"use client";

import { useState } from "react";
import Link from "next/link";
import type { Article } from "@/types";
import Image from "next/image";

interface HoverImageListProps {
  articles: Article[];
  imagePosition: "left" | "right";
  showMeta?: boolean;
  darkMode?: boolean;
}

export default function HoverImageList({
  articles,
  imagePosition,
  showMeta = false,
  darkMode = false,
}: HoverImageListProps): React.ReactElement {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeArticle = articles[activeIndex];

  return (
    <div
      className={`flex flex-col gap-4 sm:gap-6 md:gap-8 lg:flex-row lg:gap-10 ${
        imagePosition === "left" ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* Article List */}
      <div className="flex-1">
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {articles.map((article, index) => (
            <Link key={article.id} href={`/blog/${article.slug}`}>
              <div
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                role="button"
                tabIndex={0}
                className={`group cursor-pointer py-3 sm:py-4 md:py-5 transition-colors duration-200 ${
                  index !== articles.length - 1 ? "border-b border-black/20" : ""
                }`}
              >
                {/* Author (shown in dark mode instead of metadata) */}
                {darkMode && article.author ? (
                  <div className="mb-3 sm:mb-4">
                    <p className={`text-subcategory ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      {article.author.toUpperCase()}
                    </p>
                    {(article.authorCity || article.authorCountry || article.authorLocation) && (
                      <p className={`font-unbounded font-bold text-sm sm:text-base md:text-lg ${darkMode ? "text-white" : "text-black"}`}>
                        {article.authorCity && article.authorCountry
                          ? `${article.authorCity}, ${article.authorCountry}`
                          : article.authorCity || article.authorCountry || article.authorLocation}
                      </p>
                    )}
                  </div>
                ) : (
                  /* Metadata (optional, shown when not in dark mode or no author) */
                  showMeta && (
                    <p className={`mb-4 sm:mb-6 text-subcategory ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      {article.category?.replace(/-/g, " + ").toUpperCase()} |{" "}
                      {article.date}
                    </p>
                  )
                )}

                {/* Title */}
                <div className={`heading-article-title line-clamp-2 transition-all duration-200 ${darkMode ? "text-white" : "text-black"}`}>
                  {article.title}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Image Container */}
      <div className="w-full lg:w-72 flex-shrink-0">
        {activeArticle && (
          <Link href={`/blog/${activeArticle.slug}`}>
            <div className="relative overflow-hidden bg-gray-200 cursor-pointer group aspect-[373/539]">
              <Image
                src={activeArticle.image}
                alt={activeArticle.title}
                width={373}
                height={539}
                className="w-full h-full object-cover transition-all duration-500"
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
