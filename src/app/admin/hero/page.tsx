'use client';

import { useEffect, useState } from 'react';
import { getAllPostsTyped } from '@/lib/firestore';
import { getSiteSettings, updateSiteSettings } from '@/lib/settings';
import { GripVertical, X, Plus } from 'lucide-react';
import type { Post } from '@/types';

const MAX_HERO = 5;

export default function HeroPage(): React.ReactElement {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allPosts, settings] = await Promise.all([
          getAllPostsTyped(),
          getSiteSettings(),
        ]);
        const published = allPosts.filter((p) => p.status === 'published' && p.featuredImage);
        setPosts(published);
        const savedIds = settings?.heroPostIds || [];
        // Drop any saved IDs that no longer exist in visible posts
        const validIds = savedIds.filter((id) => published.some((p) => p.id === id));
        setSelectedIds(validIds);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const selectedPosts = selectedIds
    .map((id) => posts.find((p) => p.id === id))
    .filter(Boolean) as Post[];

  const availablePosts = posts.filter(
    (p) => !selectedIds.includes(p.id) &&
      (search === '' || p.title.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAdd = (id: string) => {
    if (selectedIds.length >= MAX_HERO) return;
    setSelectedIds((prev) => [...prev, id]);
    setSearch('');
  };

  const handleRemove = (id: string) => {
    setSelectedIds((prev) => prev.filter((sid) => sid !== id));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const next = [...selectedIds];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setSelectedIds(next);
  };

  const handleMoveDown = (index: number) => {
    if (index === selectedIds.length - 1) return;
    const next = [...selectedIds];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    setSelectedIds(next);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSiteSettings({ heroPostIds: selectedIds });
      setMessage('Saved!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-auto p-8">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hero Section</h1>
            <p className="text-gray-600 mt-1">Select up to {MAX_HERO} posts to feature in the hero carousel</p>
          </div>
          <div className="flex items-center gap-4">
            {message && <span className="text-sm text-green-600">{message}</span>}
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 disabled:bg-gray-400 transition"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Selected Posts */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Selected ({selectedIds.length}/{MAX_HERO})
          </h2>
          {selectedPosts.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center text-gray-400 text-sm">
              No posts selected. Add posts from below.
            </div>
          ) : (
            <div className="space-y-2">
              {selectedPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg"
                >
                  {/* Order controls */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs leading-none"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === selectedPosts.length - 1}
                      className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs leading-none"
                    >
                      ▼
                    </button>
                  </div>

                  <GripVertical className="h-4 w-4 text-gray-300 flex-shrink-0" />

                  {/* Order badge */}
                  <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>

                  {/* Thumbnail */}
                  {post.featuredImage && (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-14 h-10 object-cover rounded flex-shrink-0"
                    />
                  )}

                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                    <p className="text-xs text-gray-500 capitalize">{post.category?.replace(/-/g, ' ')}</p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemove(post.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Posts */}
        {selectedIds.length < MAX_HERO && (
          <div>
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Add Posts
            </h2>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black mb-3"
            />
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {availablePosts.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No posts found</p>
              ) : (
                availablePosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
                  >
                    {post.featuredImage && (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-14 h-10 object-cover rounded flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                      <p className="text-xs text-gray-500 capitalize">{post.category?.replace(/-/g, ' ')}</p>
                    </div>
                    <button
                      onClick={() => handleAdd(post.id)}
                      className="p-1 text-gray-400 hover:text-black transition flex-shrink-0"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
