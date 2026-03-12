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
    <section className="w-full px-8 py-16">
      <SectionHeader title="Traveller" className="mb-12" />

      {/* 4-Column Grid (lg), 2-Column (md), 1-Column (mobile) */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {travellers.map((traveller) => (
          <ProfileCard key={traveller.id} traveller={traveller} />
        ))}
      </div>
    </section>
  );
}
