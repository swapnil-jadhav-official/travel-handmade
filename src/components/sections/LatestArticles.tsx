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
    <section className="w-full flex flex-col lg:flex-row lg:h-dvh">
      {/* Left Side: Title + List */}
      <div className="flex-1 px-6 sm:px-8 lg:px-12 py-10 lg:py-12 flex flex-col">
        <div className="pb-3 border-b border-black mb-8">
          <div className="heading-main-category text-black">
            Latest Articles
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          {articles.map((article, index) => (
            <Link key={article.id} href={`/blog/${article.slug}`}>
              <div
                onMouseEnter={() => setActiveIndex(index)}
                className={`group cursor-pointer py-4 lg:py-5 transition-all duration-200 ${
                  index !== articles.length - 1 ? 'border-b border-black/20' : ''
                }`}
              >
                {article.category && (
                  <p className="text-subcategory text-gray-500 mb-2 lg:mb-3">
                    {article.category?.replace(/-/g, ' + ').toUpperCase()} | {article.date}
                  </p>
                )}
                <div className="heading-article-title line-clamp-2 text-black group-hover:opacity-60 transition-opacity duration-200">
                  {article.title}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Right Side: Featured Image (desktop only) */}
      <div className="hidden lg:block w-[400px] xl:w-[480px] flex-shrink-0 p-10 xl:p-12">
        {articles[activeIndex] && (
          <div className="relative w-full h-full bg-gray-200 overflow-hidden">
            <Image
              key={articles[activeIndex].id}
              src={articles[activeIndex].image}
              alt={articles[activeIndex].title}
              fill
              sizes="(min-width: 1280px) 480px, 400px"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
