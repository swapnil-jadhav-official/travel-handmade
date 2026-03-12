export async function uploadImageToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'travel_handmade');

  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    console.log('[Cloudinary] Uploading image to cloud:', cloudName);

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
    console.log('[Cloudinary] Image uploaded successfully:', data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error('[Cloudinary] Error uploading image:', error);
    throw error;
  }
}

export function getCloudinaryImageUrl(publicId: string, width: number = 800, height: number = 500) {
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_${width},h_${height},c_fill/${publicId}`;
}
