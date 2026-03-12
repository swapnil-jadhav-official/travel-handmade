import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader';
import type { Article } from '@/types';

interface AdventureWildlifeProps {
  article: Article;
}

export default function AdventureWildlife({
  article,
}: AdventureWildlifeProps): React.ReactElement {
  return (
    <section className="w-full px-8 py-16">
      <SectionHeader title="Adventure + Wildlife" className="mb-12" />

      {/* Hero Image with Overlay */}
      <Link href={`/blog/${article.slug}`}>
        <div className="group relative overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="h-[500px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/50" />

          {/* Title */}
          <div className="absolute bottom-8 left-8 z-10">
            <h2 className="font-unbounded font-light text-2xl text-white md:text-3xl">
              {article.title}
            </h2>
          </div>
        </div>
      </Link>
    </section>
  );
}
