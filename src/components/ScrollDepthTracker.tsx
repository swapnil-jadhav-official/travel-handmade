'use client';

import { useEffect, useRef } from 'react';
import { trackScrollDepth } from '@/lib/analytics';

export default function ScrollDepthTracker({ articleTitle }: { articleTitle: string }) {
  const tracked = useRef<Set<number>>(new Set());

  useEffect(() => {
    const checkpoints = [25, 50, 75, 100] as const;

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.round((scrollTop / docHeight) * 100);

      for (const point of checkpoints) {
        if (pct >= point && !tracked.current.has(point)) {
          tracked.current.add(point);
          trackScrollDepth(point, articleTitle);
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [articleTitle]);

  return null;
}
