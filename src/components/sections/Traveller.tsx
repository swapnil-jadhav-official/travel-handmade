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
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20">
      <SectionHeader title="Traveller" className="mb-10 sm:mb-12 md:mb-16" />

      {/* 4-Column Grid (lg), 2-Column (md), 1-Column (mobile) */}
      <div className="grid grid-cols-1 gap-0 md:grid-cols-2 lg:grid-cols-4">
        {travellers.map((traveller, index) => (
          <ProfileCard key={traveller.id} traveller={traveller} index={index} />
        ))}
      </div>
    </section>
  );
}
