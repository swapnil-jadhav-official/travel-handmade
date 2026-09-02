export async function uploadImageToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'travel_handmade');

  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[Cloudinary] Upload error response:', errorData);
      throw new Error(`Upload failed: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('[Cloudinary] Error uploading image:', error);
    throw error;
  }
}

/**
 * Rewrites a stored Cloudinary delivery URL to request an auto-optimized
 * (format + quality) version capped to the given display width, instead of
 * the full original. No-op for non-Cloudinary URLs.
 */
export function optimizeCloudinaryUrl(url: string, width?: number): string;
export function optimizeCloudinaryUrl(url: string | undefined, width?: number): string | undefined;
export function optimizeCloudinaryUrl(url: string | undefined, width?: number): string | undefined {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  const transformation = width ? `f_auto,q_auto,w_${width},c_limit` : 'f_auto,q_auto';
  return url.replace('/upload/', `/upload/${transformation}/`);
}
