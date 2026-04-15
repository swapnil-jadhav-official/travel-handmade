'use client';

import { useEffect, useRef } from 'react';

interface BlogContentProps {
  html: string;
  articleType?: 'listicle' | 'visual-gallery';
}

export default function BlogContent({ html, articleType = 'listicle' }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Remove duplicate captions that might have been added before
    const duplicateCaptions = contentRef.current.querySelectorAll(
      'figcaption + figcaption'
    );
    duplicateCaptions.forEach((el) => el.remove());

    // Find all images with captions that aren't already wrapped in figure
    const images = contentRef.current.querySelectorAll('img[data-caption]');
    images.forEach((img) => {
      const caption = img.getAttribute('data-caption');

      // Skip if already wrapped in figure/figcaption
      if (img.closest('figure')?.querySelector('figcaption')) {
        return;
      }

      if (caption) {
        // Create a figure element
        const figure = document.createElement('figure');
        figure.className = 'my-6';

        // Create figcaption
        const figcaption = document.createElement('figcaption');
        figcaption.className = 'mt-3 text-[10px] text-gray-600 text-center italic font-light';
        figcaption.textContent = caption;

        // Wrap image in figure
        img.replaceWith(figure);
        figure.appendChild(img);
        figure.appendChild(figcaption);
      }
    });

    // Style figcaptions that don't have proper classes
    const allFigcaptions = contentRef.current.querySelectorAll('figcaption');
    allFigcaptions.forEach((fc) => {
      if (!fc.className) {
        fc.className = 'mt-3 text-[10px] text-gray-600 text-center italic font-light';
      }
    });
  }, [html]);

  const galleryStyles = articleType === 'visual-gallery'
    ? ' [&_img]:w-[calc(100%+8rem)] [&_img]:-ml-16 [&_img]:max-w-none [&_figure]:w-[calc(100%+8rem)] [&_figure]:-ml-16'
    : '';

  return (
    <div
      ref={contentRef}
      className={`prose max-w-none mb-12 [&_p:empty]:min-h-4 [&_p]:text-sm [&_p]:font-[family-name:var(--font-work-sans)] [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_figure]:my-6${galleryStyles}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
