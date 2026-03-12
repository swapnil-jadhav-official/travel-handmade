import type { Traveller } from '@/types';

interface ProfileCardProps {
  traveller: Traveller;
  className?: string;
}

export default function ProfileCard({
  traveller,
  className = '',
}: ProfileCardProps): React.ReactElement {
  return (
    <div className={`group text-center ${className}`}>
      {/* Image */}
      <div className="relative mb-4 overflow-hidden rounded-lg">
        <img
          src={traveller.image}
          alt={traveller.name}
          className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Name */}
      <h3 className="font-unbounded font-light text-lg text-black">
        {traveller.name}
      </h3>

      {/* Title */}
      <p className="font-work-sans text-sm text-gray-600">
        {traveller.title}
      </p>
    </div>
  );
}
