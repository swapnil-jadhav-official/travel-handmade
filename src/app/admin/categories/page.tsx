'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Upload } from 'lucide-react';
import { getCategories, deleteCategory, createCategory, updateCategory } from '@/lib/firestore';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { useAdminDialog } from '@/hooks/useAdminDialog';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import type { Category } from '@/types';

export default function CategoriesPage(): React.ReactElement {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', subDescription: '', subDescriptionLabel: '', color: '#C55626', featuredImage: '' });
  const [formError, setFormError] = useState('');
  const { dialogProps, showConfirm, showAlert } = useAdminDialog();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      showAlert('Error', 'Failed to fetch categories. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name || !formData.slug) {
      setFormError('Name and slug are required.');
      return;
    }

    try {
      if (editingId) {
        await updateCategory(editingId, formData);
        setCategories(categories.map(c => c.id === editingId ? { ...c, ...formData } : c));
      } else {
        const newId = await createCategory(formData);
        setCategories([...categories, { id: newId, ...formData }]);
      }
      setFormData({ name: '', slug: '', description: '', subDescription: '', subDescriptionLabel: '', color: '#C55626', featuredImage: '' });
      setFormError('');
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save category:', error);
      showAlert('Error', 'Failed to save category. Please try again.');
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      subDescription: category.subDescription || '',
      subDescriptionLabel: category.subDescriptionLabel || '',
      color: category.color || '#C55626',
      featuredImage: category.featuredImage || '',
    });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    showConfirm({
      title: 'Delete Category',
      message: 'Are you sure you want to delete this category? This cannot be undone.',
      confirmLabel: 'Delete',
      onConfirm: async () => {
        try {
          await deleteCategory(id);
          setCategories((prev) => prev.filter((c) => c.id !== id));
        } catch (error) {
          console.error('Failed to delete category:', error);
          showAlert('Error', 'Failed to delete category. Please try again.');
        }
      },
    });
  };

  const handleCancel = () => {
    setFormData({ name: '', slug: '', description: '', subDescription: '', subDescriptionLabel: '', color: '#C55626', featuredImage: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        setUploading(true);
        try {
          const cloudinaryUrl = await uploadImageToCloudinary(file);
          setFormData({ ...formData, featuredImage: cloudinaryUrl });
        } catch (error) {
          console.error('Failed to upload image:', error);
          showAlert('Upload Failed', 'Failed to upload image. Please try again.');
        } finally {
          setUploading(false);
        }
      }
    };
    input.click();
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-gray-900">Categories</div>
            <p className="text-gray-600">Manage blog post categories</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded bg-black px-4 py-2 text-white hover:bg-gray-900"
          >
            <Plus className="h-4 w-4" />
            New Category
          </button>
        </div>

        {/* Category Form */}
        {showForm && (
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 text-xl font-bold text-gray-900">
              {editingId ? 'Edit Category' : 'Create New Category'}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Travel + Living"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g., travel-living"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm font-mono focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., Explore destinations and lifestyle"
                  className="h-20 w-full resize-none rounded border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sub Description Label
                  </label>
                  <input
                    type="text"
                    value={formData.subDescriptionLabel}
                    onChange={(e) => setFormData({ ...formData, subDescriptionLabel: e.target.value })}
                    placeholder="e.g., Explore"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sub Description <span className="text-gray-400 font-normal">(comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.subDescription}
                    onChange={(e) => setFormData({ ...formData, subDescription: e.target.value })}
                    placeholder="e.g., Neighbourhood Guides, Food Cultures, Mixology & Wine"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Featured Image
                </label>
                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={uploading}
                  className="flex items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="h-4 w-4" />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
                {formData.featuredImage && (
                  <div className="mt-3 rounded overflow-hidden">
                    <img
                      src={formData.featuredImage}
                      alt="Preview"
                      className="h-48 w-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#C55626"
                    className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm font-mono focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
                >
                  {editingId ? 'Update' : 'Create'} Category
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories Table */}
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-600">
            No categories yet. Create your first category.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Color
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Sub Description
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div
                        className="h-8 w-8 rounded"
                        style={{ backgroundColor: category.color }}
                        title={category.color}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {category.description || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {category.subDescription || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="inline-flex rounded px-3 py-1 text-sm text-blue-600 hover:bg-blue-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
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
