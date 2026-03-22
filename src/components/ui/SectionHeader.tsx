interface SectionHeaderProps {
  title: string;
  className?: string;
}

export default function SectionHeader({
  title,
  className = "",
}: SectionHeaderProps): React.ReactElement {
  return (
    <div className={`border-b border-black pb-2 sm:pb-3 ${className}`}>
      <div className="heading-main-category text-black">
        {title}
      </div>
    </div>
  );
}
