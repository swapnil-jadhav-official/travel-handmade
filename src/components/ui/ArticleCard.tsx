import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/types';
import { optimizeCloudinaryUrl } from '@/lib/cloudinary';

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
        <div className="relative h-72 w-full overflow-hidden bg-gray-200">
          <Image
            src={optimizeCloudinaryUrl(article.image, 800)}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
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
