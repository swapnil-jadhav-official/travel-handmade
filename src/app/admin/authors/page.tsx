'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllUserProfiles, deleteUserProfile } from '@/lib/users';
import { createAuthorAction, deleteAuthorAction, updateAuthorRoleAction, updateAuthorProfileAction } from './actions';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import type { UserProfile, UserRole } from '@/types';
import { Plus, Trash2, Shield, Edit2, X } from 'lucide-react';

export default function AuthorsPage(): React.ReactElement {
  const { canManageUsers } = useAuth();
  const [authors, setAuthors] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    city: '',
    country: '',
    role: 'author' as UserRole,
  });

  const [editingAuthor, setEditingAuthor] = useState<UserProfile | null>(null);
  const [editFormData, setEditFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    city: '',
    country: '',
    bio: '',
    avatarUrl: '',
    twitter: '',
    instagram: '',
    website: '',
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    try {
      setLoading(true);
      const profiles = await getAllUserProfiles();
      setAuthors(profiles);
    } catch (err) {
      setError('Failed to load authors');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    const result = await createAuthorAction(
      formData.email,
      formData.password,
      formData.displayName,
      formData.role,
      formData.city,
      formData.country
    );

    if (result.error) {
      setError(result.error);
    } else {
      setMessage(`Author "${formData.displayName}" created successfully!`);
      setFormData({ email: '', password: '', displayName: '', city: '', country: '', role: 'author' });
      setShowCreateForm(false);
      await loadAuthors();
      setTimeout(() => setMessage(''), 3000);
    }
    setSubmitting(false);
  };

  const handleDeleteAuthor = async (uid: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setError('');
    const result = await deleteAuthorAction(uid);

    if (result.error) {
      setError(result.error);
    } else {
      setMessage(`Author "${name}" deleted successfully!`);
      await loadAuthors();
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleUpdateRole = async (uid: string, newRole: UserRole) => {
    setError('');
    const result = await updateAuthorRoleAction(uid, newRole);

    if (result.error) {
      setError(result.error);
    } else {
      setMessage('Role updated successfully!');
      await loadAuthors();
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const openEditModal = (author: UserProfile) => {
    setEditingAuthor(author);
    setEditFormData({
      displayName: author.displayName,
      email: author.email,
      password: '',
      city: author.city || '',
      country: author.country || '',
      bio: author.bio || '',
      avatarUrl: author.avatarUrl || '',
      twitter: author.socialLinks?.twitter || '',
      instagram: author.socialLinks?.instagram || '',
      website: author.socialLinks?.website || '',
    });
  };

  const closeEditModal = () => {
    setEditingAuthor(null);
    setEditFormData({
      displayName: '',
      email: '',
      password: '',
      city: '',
      country: '',
      bio: '',
      avatarUrl: '',
      twitter: '',
      instagram: '',
      website: '',
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setEditFormData({ ...editFormData, avatarUrl: url });
      setMessage('Avatar uploaded successfully!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setError('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateAuthorProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAuthor) return;

    setSubmitting(true);
    setError('');
    setMessage('');

    const result = await updateAuthorProfileAction(
      editingAuthor.uid,
      editFormData.displayName,
      editFormData.email,
      editFormData.password,
      editFormData.bio,
      editFormData.avatarUrl,
      editFormData.city,
      editFormData.country,
      {
        twitter: editFormData.twitter,
        instagram: editFormData.instagram,
        website: editFormData.website,
      }
    );

    if (result.error) {
      setError(result.error);
    } else {
      setMessage('Author profile updated successfully!');
      closeEditModal();
      await loadAuthors();
      setTimeout(() => setMessage(''), 3000);
    }
    setSubmitting(false);
  };

  if (!canManageUsers()) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to manage authors</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="max-w-6xl mx-auto w-full p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Authors</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition"
          >
            <Plus className="h-5 w-5" />
            New Author
          </button>
        </div>

        {message && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm mb-6">
            {message}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Author</h2>
            <form onSubmit={handleCreateAuthor} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="contributor">Contributor</option>
                    <option value="author">Author</option>
                    <option value="editor">Editor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="e.g., Barcelona"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="e.g., Spain"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-900 disabled:bg-gray-400 transition"
                >
                  {submitting ? 'Creating...' : 'Create Author'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Authors Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : authors.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No authors yet. Create the first one to get started.
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Location</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Role</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Created</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {authors.map((author) => (
                  <tr key={author.uid} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{author.displayName}</td>
                    <td className="px-6 py-3 text-gray-600">{author.email}</td>
                    <td className="px-6 py-3 text-gray-600">
                      {author.city && author.country ? `${author.city}, ${author.country}` : author.country || author.city || '—'}
                    </td>
                    <td className="px-6 py-3">
                      <select
                        value={author.role}
                        onChange={(e) => handleUpdateRole(author.uid, e.target.value as UserRole)}
                        disabled={author.role === 'super_admin'}
                        className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 disabled:text-gray-500"
                      >
                        <option value="contributor">Contributor</option>
                        <option value="author">Author</option>
                        <option value="editor">Editor</option>
                        {author.role === 'super_admin' && (
                          <option value="super_admin">Super Admin</option>
                        )}
                      </select>
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {new Date(author.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(author)}
                        className="inline-flex items-center gap-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Edit author"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      {author.role !== 'super_admin' && (
                        <button
                          onClick={() => handleDeleteAuthor(author.uid, author.displayName)}
                          className="inline-flex items-center gap-2 px-3 py-1 text-red-600 hover:bg-red-50 rounded transition"
                          title="Delete author"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Author Modal */}
        {editingAuthor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Edit Author</h2>
                <button
                  onClick={closeEditModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateAuthorProfile} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.displayName}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, displayName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={editFormData.email}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, email: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="author@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password (leave blank to keep current)
                    </label>
                    <input
                      type="password"
                      value={editFormData.password}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, password: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City (optional)
                    </label>
                    <input
                      type="text"
                      value={editFormData.city}
                      onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="e.g., Barcelona"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country (optional)
                    </label>
                    <input
                      type="text"
                      value={editFormData.country}
                      onChange={(e) => setEditFormData({ ...editFormData, country: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="e.g., Spain"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={editFormData.bio}
                    onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                    maxLength={500}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Short bio about the author..."
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {editFormData.bio.length}/500 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar
                  </label>
                  <div className="flex items-center gap-4">
                    {editFormData.avatarUrl && (
                      <img
                        src={editFormData.avatarUrl}
                        alt={editFormData.displayName}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={uploading}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100"
                    />
                    {uploading && <span className="text-sm text-gray-600">Uploading...</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter (optional)
                    </label>
                    <input
                      type="text"
                      value={editFormData.twitter}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, twitter: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="@username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram (optional)
                    </label>
                    <input
                      type="text"
                      value={editFormData.instagram}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, instagram: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="@username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website (optional)
                    </label>
                    <input
                      type="url"
                      value={editFormData.website}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, website: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-900 disabled:bg-gray-400 transition"
                  >
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
