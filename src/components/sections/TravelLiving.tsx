import SectionHeader from '@/components/ui/SectionHeader';
import ArticleCard from '@/components/ui/ArticleCard';
import type { Article } from '@/types';

interface TravelLivingProps {
  articles: Article[];
}

export default function TravelLiving({
  articles,
}: TravelLivingProps): React.ReactElement {
  return (
    <section className="w-full px-8 py-16">
      <SectionHeader title="Travel + Living" className="mb-12" />

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
