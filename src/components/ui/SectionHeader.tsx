interface SectionHeaderProps {
  title: string;
  className?: string;
}

export default function SectionHeader({
  title,
  className = '',
}: SectionHeaderProps): React.ReactElement {
  return (
    <div className={`border-b border-black pb-2 ${className}`}>
      <h2 className="font-unbounded font-light text-3xl uppercase tracking-wide text-black">
        {title}
      </h2>
    </div>
  );
}
