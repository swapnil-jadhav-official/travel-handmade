import type { Traveller } from '@/types';

interface ProfileCardProps {
  traveller: Traveller;
  index?: number;
  className?: string;
}

export default function ProfileCard({
  traveller,
  index = 0,
  className = '',
}: ProfileCardProps): React.ReactElement {
  // Alternate between black and white backgrounds (even indices = black, odd = white)
  const isBlackBg = index % 2 === 0;

  return (
    <div className={`group overflow-hidden ${className}`}>
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={traveller.image}
          alt={traveller.country}
          className="h-[480px] w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Info Section with Alternating Background */}
      <div className={`px-6 py-8 ${isBlackBg ? 'bg-black' : 'bg-white border border-gray-200'}`}>
        {/* Location/Country */}
        <div className={`font-unbounded font-medium text-xl text-center ${isBlackBg ? 'text-white' : 'text-black'}`}>
          {traveller.country}
        </div>

        {/* Traveller Name */}
        <p className={`font-unbounded text-xs font-semibold text-center mt-2 tracking-widest uppercase ${isBlackBg ? 'text-white' : 'text-black'}`}>
          {traveller.traveller_name}
        </p>
      </div>
    </div>
  );
}
