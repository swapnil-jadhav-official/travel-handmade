'use client';

import { useEffect, useRef } from 'react';
import { trackSectionImpression } from '@/lib/analytics';

export default function SectionTracker({ sectionName }: { sectionName: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          trackSectionImpression(sectionName);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [sectionName]);

  return <div ref={ref} aria-hidden="true" style={{ position: 'absolute', pointerEvents: 'none' }} />;
}
