'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllPostsTyped, deletePost, getPostsByAuthorTyped } from '@/lib/firestore';
import type { Post } from '@/types';

export default function PostsPage(): React.ReactElement {
  const { user, isEditorOrAbove } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async (): Promise<void> => {
      try {
        if (isEditorOrAbove()) {
          // Editors and super admins see all posts
          const data = await getAllPostsTyped();
          setPosts(data);
        } else if (user) {
          // Authors and contributors see only their own posts
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
  }, [user, isEditorOrAbove]);

  const handleDelete = async (id: string): Promise<void> => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(id);
      setPosts(posts.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post');
    }
  };

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

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-600">
            No posts yet. Create your first post.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
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
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {post.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {post.category}
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
                      {new Date(post.createdAt).toLocaleDateString()}
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
    </div>
  );
}
