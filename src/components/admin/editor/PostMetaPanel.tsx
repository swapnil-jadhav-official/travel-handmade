'use client';

import { useState, useMemo, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { getAllUserProfiles } from '@/lib/users';
import type { UserProfile } from '@/types';

interface PostMetaPanelProps {
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  author: string;
  authorLocation?: string;
  authorCity?: string;
  authorCountry?: string;
  onTitleChange: (title: string) => void;
  onSlugChange: (slug: string) => void;
  onExcerptChange: (excerpt: string) => void;
  onFeaturedImageChange: (url: string) => void;
  onFeaturedImageRemove: () => void;
  onAuthorChange: (author: string) => void;
  onAuthorIdChange?: (authorId: string) => void;
  onAuthorLocationChange: (location: string) => void;
  onAuthorCityChange?: (city: string) => void;
  onAuthorCountryChange?: (country: string) => void;
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
  authorCity,
  authorCountry,
  onTitleChange,
  onSlugChange,
  onExcerptChange,
  onFeaturedImageChange,
  onFeaturedImageRemove,
  onAuthorChange,
  onAuthorIdChange,
  onAuthorLocationChange,
  onAuthorCityChange,
  onAuthorCountryChange,
}: PostMetaPanelProps): React.ReactElement {
  const [uploading, setUploading] = useState(false);
  const [authors, setAuthors] = useState<UserProfile[]>([]);
  const { isEditorOrAbove, userProfile } = useAuth();

  const suggestedSlug = useMemo(() => generateSlug(title), [title]);

  useEffect(() => {
    if (isEditorOrAbove()) {
      getAllUserProfiles()
        .then(setAuthors)
        .catch(() => console.error('Failed to fetch authors'));
    }
  }, [isEditorOrAbove]);

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
        {isEditorOrAbove() ? (
          <select
            value={author}
            onChange={(e) => {
              const selectedAuthor = authors.find(a => a.displayName === e.target.value);
              onAuthorChange(e.target.value);
              if (selectedAuthor) {
                onAuthorIdChange?.(selectedAuthor.uid);
                onAuthorCityChange?.(selectedAuthor.city || '');
                onAuthorCountryChange?.(selectedAuthor.country || '');
              }
            }}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-black focus:outline-none"
          >
            <option value="">Select an author...</option>
            {authors.map(a => (
              <option key={a.uid} value={a.displayName}>
                {a.displayName} {a.country && `(${a.country})`}
              </option>
            ))}
          </select>
        ) : (
          <div className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-gray-100">
            {author || userProfile?.displayName}
          </div>
        )}
      </div>

      {/* Author City & Country */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Author City
          </label>
          <input
            type="text"
            value={authorCity || ''}
            onChange={(e) => onAuthorCityChange?.(e.target.value)}
            placeholder="e.g., Bangkok"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Author Country
          </label>
          <input
            type="text"
            value={authorCountry || ''}
            onChange={(e) => onAuthorCountryChange?.(e.target.value)}
            placeholder="e.g., Thailand"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none"
          />
        </div>
      </div>

      {/* Author Location (Legacy) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Author Location (Legacy)
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
