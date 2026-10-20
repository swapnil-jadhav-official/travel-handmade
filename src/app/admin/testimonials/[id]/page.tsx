'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createTestimonial, getTestimonials, updateTestimonial } from '@/lib/firestore';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { ArrowLeft, Upload, X } from 'lucide-react';
import type { Testimonial } from '@/types';

export default function TestimonialEditor(): React.ReactElement {
  const router = useRouter();
  const params = useParams();
  const testimonialId = params.id as string;
  const isNew = testimonialId === 'new';

  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [image, setImage] = useState('');
  const [articleTitle, setArticleTitle] = useState('');
  const [articleUrl, setArticleUrl] = useState('');
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (!isNew) {
      fetchTestimonial();
    }
  }, [isNew, testimonialId]);

  const fetchTestimonial = async () => {
    try {
      setIsLoading(true);
      const testimonials = await getTestimonials();
      const testimonial = testimonials.find((t) => t.id === testimonialId);
      if (testimonial) {
        setQuote(testimonial.quote);
        setAuthor(testimonial.author);
        setImage(testimonial.image);
        setImagePreview(testimonial.image);
        setArticleTitle(testimonial.articleTitle || '');
        setArticleUrl(testimonial.articleUrl || '');
      } else {
        setError('Testimonial not found');
      }
    } catch (err) {
      setError('Failed to load testimonial');
      console.error('Error loading testimonial:', err);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!quote.trim()) {
      setError('Quote is required');
      return;
    }

    if (!author.trim()) {
      setError('Author name is required');
      return;
    }

    if (!image) {
      setError('Image is required');
      return;
    }

    setIsSaving(true);

    try {
      if (isNew) {
        await createTestimonial({
          quote: quote.trim(),
          author: author.trim(),
          image,
          articleTitle: articleTitle.trim() || undefined,
          articleUrl: articleUrl.trim() || undefined,
        });
      } else {
        await updateTestimonial(testimonialId, {
          quote: quote.trim(),
          author: author.trim(),
          image,
          articleTitle: articleTitle.trim() || undefined,
          articleUrl: articleUrl.trim() || undefined,
        });
      }
      router.push('/admin/testimonials');
    } catch (err) {
      setError(`Failed to ${isNew ? 'create' : 'update'} testimonial. Please try again.`);
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
            {isNew ? 'New Testimonial' : 'Edit Testimonial'}
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Quote Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Quote
            </label>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Enter the testimonial quote..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">{quote.length} characters</p>
          </div>

          {/* Author Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Author Name
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

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
                    alt="Testimonial"
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

          {/* Article Title Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Article Title (Optional)
            </label>
            <input
              type="text"
              value={articleTitle}
              onChange={(e) => setArticleTitle(e.target.value)}
              placeholder="Enter article title..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Article URL Field */}
          {articleTitle && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Article URL
              </label>
              <input
                type="url"
                value={articleUrl}
                onChange={(e) => setArticleUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-900 disabled:bg-gray-400 transition"
            >
              {isSaving ? 'Saving...' : 'Save Testimonial'}
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
