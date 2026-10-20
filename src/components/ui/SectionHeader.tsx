interface SectionHeaderProps {
  title: string;
  className?: string;
}

export default function SectionHeader({
  title,
  className = "",
}: SectionHeaderProps): React.ReactElement {
  return (
    <div className={`border-b border-gray-300 pb-2 sm:pb-3 ${className}`}>
      <div className="heading-main-category text-black">
        {title}
      </div>
    </div>
  );
}
