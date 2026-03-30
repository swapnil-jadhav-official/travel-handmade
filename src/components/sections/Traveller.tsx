import SectionHeader from '@/components/ui/SectionHeader';
import ProfileCard from '@/components/ui/ProfileCard';
import type { Traveller } from '@/types';

interface TravellerProps {
  travellers: Traveller[];
}

export default function TravellerSection({
  travellers,
}: TravellerProps): React.ReactElement {
  return (
    <section className="w-full flex flex-col lg:h-dvh">
      <div className="px-6 sm:px-8 lg:px-12 pt-10 pb-6 lg:pt-12 lg:pb-8">
        <SectionHeader title="Traveller" />
      </div>

      {/* 4-Column Grid (lg), 2-Column (md), 1-Column (mobile) */}
      <div className="flex-1 grid grid-cols-1 gap-0 md:grid-cols-2 lg:grid-cols-4 px-6 sm:px-8 lg:px-12">
        {travellers.map((traveller, index) => (
          <ProfileCard key={traveller.id} traveller={traveller} index={index} />
        ))}
      </div>
    </section>
  );
}
