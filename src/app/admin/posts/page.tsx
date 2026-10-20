'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Trash2, Edit, Search, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllPostsTyped, deletePost, getPostsByAuthorTyped, restorePost } from '@/lib/firestore';
import { useAdminDialog } from '@/hooks/useAdminDialog';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import type { Post } from '@/types';

export default function PostsPage(): React.ReactElement {
  const { user, isEditorOrAbove } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const { dialogProps, showConfirm, showAlert } = useAdminDialog();

  useEffect(() => {
    const fetchPosts = async (): Promise<void> => {
      try {
        if (isEditorOrAbove()) {
          const data = await getAllPostsTyped();
          setPosts(data);
        } else if (user) {
          const data = await getPostsByAuthorTyped(user.uid);
          setPosts(data);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  // isEditorOrAbove is a function recreated each render — excluding it is intentional
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDelete = (id: string): void => {
    showConfirm({
      title: 'Delete Post',
      message: 'This post will be moved to Trash. You can restore it from there.',
      confirmLabel: 'Move to Trash',
      onConfirm: async () => {
        try {
          await deletePost(id);
          setPosts((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
          console.error('Failed to delete post:', error);
          showAlert('Error', 'Failed to delete post. Please try again.');
        }
      },
    });
  };

  const categories = useMemo(() => {
    const categoryOrder = [
      'travel-living',
      'adventure-wildlife',
      'food-drinks',
      'retreats',
      'wellness',
      'changemaker',
      'traveller',
    ];
    const cats = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));
    return cats.sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a);
      const bIndex = categoryOrder.indexOf(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }, [posts]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return posts.filter((p) => {
      if (activeCategory !== 'all' && p.category !== activeCategory) return false;
      if (!term) return true;
      return (
        p.title?.toLowerCase().includes(term) ||
        p.authorName?.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term) ||
        p.tags?.some((t) => t.toLowerCase().includes(term))
      );
    });
  }, [posts, activeCategory, search]);

  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-gray-900">Posts</div>
            <p className="text-gray-600">Manage all your blog posts</p>
          </div>
          <Link
            href="/admin/posts/new"
            className="rounded bg-black px-4 py-2 text-white hover:bg-gray-900"
          >
            New Post
          </Link>
        </div>

        {/* Search */}
        {!loading && posts.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, author, category or tag…"
              className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-9 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Category filter chips */}
        {!loading && posts.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === 'all'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({posts.length})
            </button>
            {categories.map((cat) => {
              const count = posts.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors capitalize ${
                    activeCategory === cat
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.replace(/-/g, ' ')} ({count})
                </button>
              );
            })}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-600">
            {posts.length === 0
              ? 'No posts yet. Create your first post.'
              : search
                ? `No posts match "${search}".`
                : 'No posts in this category.'}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Image</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post) => (
                  <tr key={post.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {post.featuredImage ? (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="h-12 w-12 rounded object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                          No image
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{post.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                      {post.category?.replace(/-/g, ' ')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          post.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : post.status === 'draft'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/posts/${post.id}`}
                          className="inline-flex rounded p-2 hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4 text-gray-600" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="inline-flex rounded p-2 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ConfirmDialog {...dialogProps} />
    </div>
  );
}
