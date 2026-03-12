'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { getCategories } from '@/lib/firestore';
import type { PostStatus, PostVisibility, Category } from '@/types';

interface PostPublishPanelProps {
  status: PostStatus;
  visibility: PostVisibility;
  password?: string;
  scheduledAt?: string;
  category: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  wordCount: number;
  onStatusChange: (status: PostStatus) => void;
  onVisibilityChange: (visibility: PostVisibility) => void;
  onPasswordChange: (password: string) => void;
  onScheduledAtChange: (date: string) => void;
  onCategoryChange: (category: string) => void;
  onTagsChange: (tags: string[]) => void;
  onSeoTitleChange: (title: string) => void;
  onSeoDescriptionChange: (desc: string) => void;
}

export default function PostPublishPanel({
  status,
  visibility,
  password,
  scheduledAt,
  category,
  tags,
  seoTitle,
  seoDescription,
  wordCount,
  onStatusChange,
  onVisibilityChange,
  onPasswordChange,
  onScheduledAtChange,
  onCategoryChange,
  onTagsChange,
  onSeoTitleChange,
  onSeoDescriptionChange,
}: PostPublishPanelProps): React.ReactElement {
  const [tagInput, setTagInput] = useState('');
  const [seoExpanded, setSeoExpanded] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const readingTime = useMemo(() => {
    const minutes = Math.ceil(wordCount / 200);
    return minutes === 0 ? 1 : minutes;
  }, [wordCount]);

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && tagInput.trim()) {
      onTagsChange([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-white px-6 py-6 overflow-y-auto">
      {/* Status & Visibility */}
      <div className="space-y-4 rounded-lg border border-gray-200 p-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as PostStatus)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Visibility
          </label>
          <select
            value={visibility}
            onChange={(e) =>
              onVisibilityChange(e.target.value as PostVisibility)
            }
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="password">Password Protected</option>
          </select>
        </div>

        {visibility === 'password' && (
          <input
            type="password"
            value={password || ''}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Enter password"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
          />
        )}

        {status === 'scheduled' && (
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Schedule
            </label>
            <input
              type="datetime-local"
              value={scheduledAt || ''}
              onChange={(e) => onScheduledAtChange(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2 rounded-lg border border-gray-200 p-4">
        <label className="block text-sm font-medium text-gray-900">
          Category
        </label>
        {categoriesLoading ? (
          <div className="text-sm text-gray-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="text-sm text-gray-500">No categories available</div>
        ) : (
          categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2">
              <input
                type="radio"
                name="category"
                value={cat.slug}
                checked={category === cat.slug}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">{cat.name}</span>
            </label>
          ))
        )}
      </div>

      {/* Tags */}
      <div className="rounded-lg border border-gray-200 p-4">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Tags
        </label>
        <div className="mb-2 flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
            >
              {tag}
              <button
                onClick={() =>
                  onTagsChange(tags.filter((_, i) => i !== idx))
                }
                className="hover:text-gray-900"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagAdd}
          placeholder="Add tag, press Enter"
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
        />
      </div>

      {/* Reading Stats */}
      <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
        <div>Words: {wordCount}</div>
        <div>Reading time: ~{readingTime} min</div>
      </div>

      {/* SEO Section (Collapsible) */}
      <button
        onClick={() => setSeoExpanded(!seoExpanded)}
        className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-left font-medium text-gray-900 hover:bg-gray-50"
      >
        SEO Settings
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            seoExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {seoExpanded && (
        <div className="space-y-3 rounded-lg border border-gray-200 p-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              SEO Title
            </label>
            <input
              type="text"
              value={seoTitle || ''}
              onChange={(e) => onSeoTitleChange(e.target.value)}
              placeholder="Falls back to post title"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Meta Description ({(seoDescription || '').length}/160)
            </label>
            <textarea
              value={seoDescription || ''}
              onChange={(e) =>
                onSeoDescriptionChange(e.target.value.slice(0, 160))
              }
              maxLength={160}
              placeholder="Description for search results"
              className="h-20 w-full resize-none rounded border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
