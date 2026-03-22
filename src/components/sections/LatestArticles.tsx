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
    <section className="w-full min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 flex flex-col">
      <SectionHeader title="Latest Articles" className="mb-10 sm:mb-12 md:mb-16" />
      <div className="flex-1 flex flex-col justify-center">
        <HoverImageList
          articles={articles}
          imagePosition="right"
          showMeta={true}
        />
      </div>
    </section>
  );
}
