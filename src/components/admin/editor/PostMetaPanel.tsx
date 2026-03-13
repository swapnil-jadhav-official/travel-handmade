'use client';

import { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

interface PostMetaPanelProps {
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  author: string;
  authorLocation?: string;
  onTitleChange: (title: string) => void;
  onSlugChange: (slug: string) => void;
  onExcerptChange: (excerpt: string) => void;
  onFeaturedImageChange: (url: string) => void;
  onFeaturedImageRemove: () => void;
  onAuthorChange: (author: string) => void;
  onAuthorLocationChange: (location: string) => void;
}

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export default function PostMetaPanel({
  title,
  slug,
  excerpt,
  featuredImage,
  author,
  authorLocation,
  onTitleChange,
  onSlugChange,
  onExcerptChange,
  onFeaturedImageChange,
  onFeaturedImageRemove,
  onAuthorChange,
  onAuthorLocationChange,
}: PostMetaPanelProps): React.ReactElement {
  const [uploading, setUploading] = useState(false);

  const suggestedSlug = useMemo(() => generateSlug(title), [title]);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      onFeaturedImageChange(url);
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 bg-gray-50 px-6 py-6 overflow-y-auto">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Post title"
          className="w-full rounded border border-gray-300 px-3 py-2 text-base font-semibold text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Slug
        </label>
        <div className="space-y-1">
          <input
            type="text"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            placeholder="url-slug"
            className="w-full rounded border border-gray-300 px-3 py-2 font-mono text-sm text-gray-900 focus:border-black focus:outline-none"
          />
          {slug !== suggestedSlug && (
            <button
              onClick={() => onSlugChange(suggestedSlug)}
              className="text-xs text-blue-600 hover:underline"
            >
              Use suggested: {suggestedSlug}
            </button>
          )}
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Excerpt ({excerpt.length}/160)
        </label>
        <textarea
          value={excerpt}
          onChange={(e) => onExcerptChange(e.target.value.slice(0, 160))}
          placeholder="Brief summary of the post"
          maxLength={160}
          className="h-20 w-full resize-none rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none"
        />
      </div>

      {/* Author */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Author
        </label>
        <input
          type="text"
          value={author}
          onChange={(e) => onAuthorChange(e.target.value)}
          placeholder="Author name"
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none"
        />
      </div>

      {/* Author Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Author Location
        </label>
        <input
          type="text"
          value={authorLocation || ''}
          onChange={(e) => onAuthorLocationChange(e.target.value)}
          placeholder="e.g., Thailand, New Zealand"
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none"
        />
      </div>

      {/* Featured Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Featured Image
        </label>
        {featuredImage ? (
          <div className="relative">
            <img
              src={featuredImage}
              alt="Featured"
              className="h-40 w-full rounded object-cover"
            />
            <button
              onClick={onFeaturedImageRemove}
              className="absolute right-2 top-2 rounded bg-black/50 p-1 text-white hover:bg-black"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white px-6 py-8 text-center hover:border-gray-400">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
            <div className="text-sm text-gray-600">
              {uploading ? 'Uploading...' : 'Click to upload featured image'}
            </div>
          </label>
        )}
      </div>
    </div>
  );
}
