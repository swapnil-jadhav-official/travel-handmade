/**
 * Custom next/image loader for Cloudinary-hosted images.
 *
 * Next.js calls this per rendered size (including retina/DPR variants),
 * so the exact width requested here is whatever the framework determines
 * the device actually needs — unlike a fixed width baked into the URL
 * ahead of time, this can never under-serve a high-density display.
 */
export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (!src.includes('res.cloudinary.com') || !src.includes('/upload/')) {
    return src;
  }
  const q = quality ? `q_${quality}` : 'q_auto';
  return src.replace('/upload/', `/upload/f_auto,${q},w_${width},c_limit/`);
}
