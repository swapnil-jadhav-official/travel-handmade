import SectionHeader from '@/components/ui/SectionHeader';
import HoverImageList from '@/components/ui/HoverImageList';
import type { Article } from '@/types';

interface LatestArticlesProps {
  articles: Article[];
}

export default function LatestArticles({
  articles,
}: LatestArticlesProps): React.ReactElement {
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
      <SectionHeader title="Latest Articles" className="mb-8 sm:mb-10 md:mb-12" />
      <HoverImageList
        articles={articles}
        imagePosition="right"
        showMeta={true}
      />
    </section>
  );
}
