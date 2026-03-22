import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/types';

interface LatestArticlesProps {
  articles: Article[];
}

export default function LatestArticles({
  articles,
}: LatestArticlesProps): React.ReactElement {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="w-full h-screen flex flex-col lg:flex-row">
      {/* Left Side: Title + List */}
      <div className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-10 md:py-12 flex flex-col overflow-hidden">
        <div className="pb-2 sm:pb-3 border-b border-black mb-6 sm:mb-8 md:mb-10">
          <div className="heading-main-category text-black">
            Latest Articles
          </div>
        </div>
        <div className="space-y-4 sm:space-y-5 md:space-y-6 flex-1">
          {articles.map((article, index) => (
            <Link key={article.id} href={`/blog/${article.slug}`}>
              <div
                onMouseEnter={() => setActiveIndex(index)}
                className={`group cursor-pointer py-3 sm:py-4 md:py-5 transition-colors duration-200 ${
                  index !== articles.length - 1 ? "border-b border-black/20" : ""
                }`}
              >
                {article.category && (
                  <p className="text-subcategory text-gray-600 mb-4 sm:mb-6">
                    {article.category?.replace(/-/g, " + ").toUpperCase()} | {article.date}
                  </p>
                )}
                <div className="heading-article-title line-clamp-2 text-black">
                  {article.title}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Right Side: Featured Image - Full Viewport Height */}
      <div className="hidden lg:flex w-96 flex-shrink-0 h-screen p-8 sm:p-10 md:p-12">
        {articles[activeIndex] && (
          <div className="w-full h-full bg-gray-200 overflow-hidden">
            <Image
              src={articles[activeIndex].image}
              alt={articles[activeIndex].title}
              width={373}
              height={539}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
