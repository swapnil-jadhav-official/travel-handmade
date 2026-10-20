'use client';

import { useEffect, useState } from 'react';
import { Trash2, RotateCcw } from 'lucide-react';
import { getSoftDeletedPosts, restorePost, permanentlyDeletePost } from '@/lib/firestore';
import { useAdminDialog } from '@/hooks/useAdminDialog';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import type { Post } from '@/types';

export default function TrashPage(): React.ReactElement {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { dialogProps, showConfirm, showAlert } = useAdminDialog();

  useEffect(() => {
    getSoftDeletedPosts()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRestore = (id: string) => {
    showConfirm({
      title: 'Restore Post',
      message: 'This post will be moved back to your posts list.',
      confirmLabel: 'Restore',
      variant: 'info',
      onConfirm: async () => {
        try {
          await restorePost(id);
          setPosts((prev) => prev.filter((p) => p.id !== id));
        } catch {
          showAlert('Error', 'Failed to restore post. Please try again.');
        }
      },
    });
  };

  const handlePermanentDelete = (id: string) => {
    showConfirm({
      title: 'Permanently Delete',
      message: 'This will permanently remove the post from Firestore. This action cannot be undone.',
      confirmLabel: 'Delete Forever',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await permanentlyDeletePost(id);
          setPosts((prev) => prev.filter((p) => p.id !== id));
        } catch {
          showAlert('Error', 'Failed to permanently delete post. Please try again.');
        }
      },
    });
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-6 p-8">
        <div>
          <div className="text-3xl font-bold text-gray-900">Trash</div>
          <p className="text-gray-600">Soft-deleted posts — restore or permanently delete them</p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-600">
            Trash is empty.
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
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Deleted At</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {post.featuredImage ? (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="h-12 w-12 rounded object-cover opacity-60"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                          No image
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-500">{post.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 capitalize">
                      {post.category?.replace(/-/g, ' ')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-500">
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {post.deletedAt ? new Date(post.deletedAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleRestore(post.id)}
                          title="Restore"
                          className="inline-flex rounded p-2 hover:bg-green-50"
                        >
                          <RotateCcw className="h-4 w-4 text-green-600" />
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(post.id)}
                          title="Permanently delete"
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
