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
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
      <SectionHeader title="Traveller" className="mb-8 sm:mb-10 md:mb-12" />

      {/* 4-Column Grid (lg), 2-Column (md), 1-Column (mobile) */}
      <div className="grid grid-cols-1 gap-0 md:grid-cols-2 lg:grid-cols-4">
        {travellers.map((traveller, index) => (
          <ProfileCard key={traveller.id} traveller={traveller} index={index} />
        ))}
      </div>
    </section>
  );
}
