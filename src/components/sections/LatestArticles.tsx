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
      <div className="hidden lg:flex flex-col w-[490px] xl:w-[570px] flex-shrink-0 pl-16 pr-10 xl:pl-20 xl:pr-12 py-10 lg:py-12">
        {/* Invisible spacer — aligns image top with the border line */}
        <div className="pb-3 flex-shrink-0">
          <div className="heading-main-category opacity-0 select-none">Latest Articles</div>
        </div>
        {/* Image fills remaining height */}
        {articles[activeIndex] && (
          <div className="relative flex-1 bg-gray-200 overflow-hidden">
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
