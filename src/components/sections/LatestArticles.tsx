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
    <section className="w-full px-8 py-16">
      <SectionHeader title="Latest Articles" className="mb-12" />
      <HoverImageList
        articles={articles}
        imagePosition="right"
        showMeta={true}
      />
    </section>
  );
}
