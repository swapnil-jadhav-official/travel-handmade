import SectionHeader from '@/components/ui/SectionHeader';
import ArticleCard from '@/components/ui/ArticleCard';
import type { Article } from '@/types';

interface FoodDrinksProps {
  articles: Article[];
}

export default function FoodDrinks({
  articles,
}: FoodDrinksProps): React.ReactElement {
  return (
    <section className="w-full px-8 py-16">
      <SectionHeader title="Food + Drinks" className="mb-12" />

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
