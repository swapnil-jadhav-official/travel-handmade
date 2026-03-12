import SectionHeader from '@/components/ui/SectionHeader';
import HoverImageList from '@/components/ui/HoverImageList';
import type { Article } from '@/types';

interface RetreatsProps {
  articles: Article[];
}

export default function Retreats({
  articles,
}: RetreatsProps): React.ReactElement {
  return (
    <section className="w-full px-8 py-16">
      <SectionHeader title="Retreats" className="mb-12" />
      <HoverImageList
        articles={articles}
        imagePosition="left"
        showMeta={false}
      />
    </section>
  );
}
