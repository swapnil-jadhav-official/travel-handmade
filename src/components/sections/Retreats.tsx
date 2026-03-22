import HoverImageList from "@/components/ui/HoverImageList";
import type { Article } from "@/types";

interface RetreatsProps {
  articles: Article[];
}

export default function Retreats({
  articles,
}: RetreatsProps): React.ReactElement {
  return (
    <section className="w-full bg-black py-8 sm:py-12 md:py-16">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 mb-8 sm:mb-10 md:mb-12">
        <div className="heading-main-category-dark border-b border-white pb-2 sm:pb-3">
          Retreats
        </div>
      </div>
      <div className="px-4 sm:px-6 md:px-8 lg:px-12">
        <HoverImageList
          articles={articles}
          imagePosition="right"
          showMeta={true}
          darkMode={true}
        />
      </div>
    </section>
  );
}
