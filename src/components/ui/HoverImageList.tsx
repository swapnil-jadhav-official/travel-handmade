"use client";

import { useState } from "react";
import Link from "next/link";
import type { Article } from "@/types";
import Image from "next/image";

interface HoverImageListProps {
  articles: Article[];
  imagePosition: "left" | "right";
  showMeta?: boolean;
}

export default function HoverImageList({
  articles,
  imagePosition,
  showMeta = false,
}: HoverImageListProps): React.ReactElement {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeArticle = articles[activeIndex];

  return (
    <div
      className={`flex flex-col gap-16 lg:flex-row lg:gap-20 ${
        imagePosition === "left" ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* Article List */}
      <div className="flex-1">
        <div className="space-y-4">
          {articles.map((article, index) => (
            <Link key={article.id} href={`/blog/${article.slug}`}>
              <div
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                role="button"
                tabIndex={0}
                className={`group cursor-pointer py-5 transition-colors duration-200 ${
                  index !== articles.length - 1 ? "border-b border-black/20" : ""
                }`}
              >
                {/* Metadata (optional) */}
                {showMeta && (
                  <p className="mb-2 font-work-sans text-xs text-gray-600">
                    {article.category?.replace(/-/g, " + ").toUpperCase()} |{" "}
                    {article.date}
                  </p>
                )}

                {/* Title */}
                <h3 className="font-unbounded font-bold text-base text-black transition-all duration-200 group-hover:underline">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Image Container */}
      <div className="w-full lg:w-[40%]">
        {activeArticle && (
          <Link href={`/blog/${activeArticle.slug}`}>
            <div className="relative overflow-hidden bg-gray-200 cursor-pointer group">
              <Image
                src={activeArticle.image}
                alt={activeArticle.title}
                width={600}
                height={384}
                className="h-96 w-full object-cover transition-all duration-500 group-hover:scale-105"
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
