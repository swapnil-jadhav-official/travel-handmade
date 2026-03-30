import Link from 'next/link';
import type { Article } from '@/types';

interface ArticleCardProps {
  article: Article;
  className?: string;
}

export default function ArticleCard({
  article,
  className = '',
}: ArticleCardProps): React.ReactElement {
  return (
    <Link href={`/blog/${article.slug}`}>
      <article className={`group cursor-pointer ${className}`}>
        {/* Image Container */}
        <div className="relative w-full overflow-hidden bg-gray-200">
          <img
            src={article.image}
            alt={article.title}
            className="h-72 w-full object-cover"
          />
        </div>

        {/* Title */}
        <div className="pt-4">
          <div className="font-unbounded font-light text-lg text-black transition-all duration-300 group-hover:underline">
            {article.title}
          </div>
        </div>
      </article>
    </Link>
  );
}
