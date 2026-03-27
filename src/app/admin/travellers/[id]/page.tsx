'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createTraveller, getTravellers, updateTraveller } from '@/lib/firestore';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { ArrowLeft, X } from 'lucide-react';
import type { Traveller } from '@/types';

export default function TravellerEditor(): React.ReactElement {
  const router = useRouter();
  const params = useParams();
  const travellerId = params.id as string;
  const isNew = travellerId === 'new';

  const [traveller_name, setTravellerName] = useState('');
  const [country, setCountry] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [articleName, setArticleName] = useState('');
  const [articleUrl, setArticleUrl] = useState('');
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (!isNew) {
      fetchTraveller();
    }
  }, [isNew, travellerId]);

  const fetchTraveller = async () => {
    try {
      setIsLoading(true);
      const travellers = await getTravellers();
      const foundTraveller = travellers.find((t) => t.id === travellerId);
      if (foundTraveller) {
        setTravellerName(foundTraveller.traveller_name);
        setCountry(foundTraveller.country);
        setSlug(foundTraveller.slug);
        setImage(foundTraveller.image);
        setImagePreview(foundTraveller.image);
        setArticleName(foundTraveller.articleName || '');
        setArticleUrl(foundTraveller.articleUrl || '');
      } else {
        setError('Traveller not found');
      }
    } catch (err) {
      setError('Failed to load traveller');
      console.error('Error loading traveller:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      const url = await uploadImageToCloudinary(file);
      setImage(url);
      setImagePreview(url);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImage('');
    setImagePreview('');
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTravellerName(value);
    // Auto-generate slug if it's empty or was previously auto-generated
    if (!slug || slug === generateSlug(traveller_name)) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!traveller_name.trim()) {
      setError('Traveller name is required');
      return;
    }

    if (!country.trim()) {
      setError('Country is required');
      return;
    }

    if (!slug.trim()) {
      setError('Slug is required');
      return;
    }

    if (!image) {
      setError('Image is required');
      return;
    }

    setIsSaving(true);

    try {
      if (isNew) {
        await createTraveller({
          traveller_name: traveller_name.trim(),
          country: country.trim(),
          slug: slug.trim(),
          image,
          ...(articleName.trim() && { articleName: articleName.trim() }),
          ...(articleUrl.trim() && { articleUrl: articleUrl.trim() }),
        });
      } else {
        await updateTraveller(travellerId, {
          traveller_name: traveller_name.trim(),
          country: country.trim(),
          slug: slug.trim(),
          image,
          ...(articleName.trim() && { articleName: articleName.trim() }),
          ...(articleUrl.trim() && { articleUrl: articleUrl.trim() }),
        });
      }
      router.push('/admin/travellers');
    } catch (err) {
      setError(`Failed to ${isNew ? 'create' : 'update'} traveller. Please try again.`);
      console.error('Submit error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="max-w-2xl mx-auto w-full p-8">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="max-w-2xl mx-auto w-full p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isNew ? 'New Traveller' : 'Edit Traveller'}
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Traveller Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Traveller Name
            </label>
            <input
              type="text"
              value={traveller_name}
              onChange={handleNameChange}
              placeholder="Enter traveller name..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Country
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Enter country..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Slug (URL-friendly name)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generated-slug"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900"
            />
            <p className="text-xs text-gray-500 mt-1">Auto-generated from name, but you can customize it</p>
          </div>

          {/* Article Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Article Name (Optional)
            </label>
            <input
              type="text"
              value={articleName}
              onChange={(e) => setArticleName(e.target.value)}
              placeholder="Enter article name..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900"
            />
          </div>

          {/* Article URL */}
          {(articleName || articleUrl) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Article URL
              </label>
              <input
                type="url"
                value={articleUrl}
                onChange={(e) => setArticleUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900"
              />
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Image
            </label>
            <div className="flex items-start gap-6">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Traveller"
                    className="w-40 h-40 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="w-40 h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <span className="text-xs text-gray-500 text-center">No image</span>
                </div>
              )}
              <div className="flex-1">
                <label htmlFor="image" className="block">
                  <span className="sr-only">Upload image</span>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-black file:text-white
                      hover:file:bg-gray-900
                      disabled:file:bg-gray-400"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-900 disabled:bg-gray-400 transition"
            >
              {isSaving ? 'Saving...' : 'Save Traveller'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
