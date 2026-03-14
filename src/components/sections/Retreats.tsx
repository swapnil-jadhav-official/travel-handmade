import HoverImageList from "@/components/ui/HoverImageList";
import type { Article } from "@/types";

interface RetreatsProps {
  articles: Article[];
}

export default function Retreats({
  articles,
}: RetreatsProps): React.ReactElement {
  return (
    <section className="w-full bg-black py-16">
      <div className="px-8 mb-12">
        <div className="font-unbounded font-light text-3xl uppercase tracking-wide text-white border-b border-white pb-2">
          Retreats
        </div>
      </div>
      <div className="px-8">
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
