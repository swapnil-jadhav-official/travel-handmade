'use client';

import { useMemo } from 'react';
import { optimizeCloudinaryUrl } from '@/lib/cloudinary';

interface BlogContentProps {
  html: string;
  articleType?: 'listicle' | 'visual-gallery';
}

const CAPTION_CLASS = 'mt-3 text-[10px] text-gray-600 text-center italic font-light';

function getAttributeValue(tag: string, name: string): string {
  const match = tag.match(new RegExp(`\\s${name}=(["'])([\\s\\S]*?)\\1`, 'i'));
  return match?.[2]?.trim() || '';
}

function decodeBasicEntities(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isInsideFigure(html: string, offset: number): boolean {
  const beforeImage = html.slice(0, offset).toLowerCase();
  return beforeImage.lastIndexOf('<figure') > beforeImage.lastIndexOf('</figure');
}

function optimizeContentImages(html: string): string {
  return html.replace(/(<img\b[^>]*\ssrc=)(["'])([\s\S]*?)\2/gi, (match, prefix, quote, src) => {
    const optimized = optimizeCloudinaryUrl(src, 1200);
    return `${prefix}${quote}${optimized}${quote}`;
  });
}

function addImageCaptions(html: string): string {
  return html.replace(/<img\b[^>]*>/gi, (imgTag, offset: number) => {
    if (isInsideFigure(html, offset)) return imgTag;

    const caption =
      getAttributeValue(imgTag, 'data-caption') ||
      getAttributeValue(imgTag, 'caption') ||
      getAttributeValue(imgTag, 'title') ||
      '';
    const alt = getAttributeValue(imgTag, 'alt');
    const fallbackCaption = alt && alt !== 'Image' ? alt : '';
    const captionText = decodeBasicEntities(caption || fallbackCaption);

    if (!captionText) return `<figure class="my-6">${imgTag}</figure>`;

    return `<figure class="my-6">${imgTag}<figcaption class="${CAPTION_CLASS}">${escapeHtml(captionText)}</figcaption></figure>`;
  });
}

export default function BlogContent({ html, articleType = 'listicle' }: BlogContentProps) {
  const htmlWithCaptions = useMemo(() => addImageCaptions(optimizeContentImages(html)), [html]);

  const galleryStyles = articleType === 'visual-gallery'
    ? ' [&_figure]:w-full [&_figure]:lg:w-[calc(100%+8rem)] [&_figure]:lg:-ml-16 [&_figure_img]:w-full [&_figure_img]:max-w-none [&_figure_img]:lg:w-full'
    : '';

  return (
    <div
      className={`prose max-w-none mb-12 [&_p:empty]:min-h-4 [&_p]:text-sm [&_p]:font-[family-name:var(--font-work-sans)] [&_p]:leading-[1.61] [&_h1]:text-2xl [&_h1]:font-[family-name:var(--font-unbounded)] [&_h2]:text-xl [&_h2]:font-[family-name:var(--font-unbounded)] [&_h3]:text-lg [&_h3]:font-[family-name:var(--font-unbounded)] [&_h4]:font-[family-name:var(--font-unbounded)] [&_figure]:my-6${galleryStyles}`}
      dangerouslySetInnerHTML={{ __html: htmlWithCaptions }}
    />
  );
}
