'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTestimonials, deleteTestimonial } from '@/lib/firestore';
import { getSiteSettings, updateSiteSettings } from '@/lib/settings';
import { Trash2, Edit2, Plus, Video } from 'lucide-react';
import type { Testimonial } from '@/types';

export default function TestimonialsPage(): React.ReactElement {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [featuredVideoUrl, setFeaturedVideoUrl] = useState('');
  const [featuredVideoTitle, setFeaturedVideoTitle] = useState('');
  const [featuredVideoCreator, setFeaturedVideoCreator] = useState('');
  const [isSavingVideo, setIsSavingVideo] = useState(false);
  const [videoMessage, setVideoMessage] = useState('');

  useEffect(() => {
    fetchTestimonials();
    fetchVideoSettings();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideoSettings = async () => {
    try {
      const data = await getSiteSettings();
      if (data) {
        setFeaturedVideoUrl(data.featuredVideoUrl || '');
        setFeaturedVideoTitle(data.featuredVideoTitle || '');
        setFeaturedVideoCreator(data.featuredVideoCreator || '');
      }
    } catch (error) {
      console.error('Failed to fetch video settings:', error);
    }
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingVideo(true);
    try {
      await updateSiteSettings({
        featuredVideoUrl: featuredVideoUrl.trim() || undefined,
        featuredVideoTitle: featuredVideoTitle.trim() || undefined,
        featuredVideoCreator: featuredVideoCreator.trim() || undefined,
      });
      setVideoMessage('Saved!');
      setTimeout(() => setVideoMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save video settings:', error);
    } finally {
      setIsSavingVideo(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      setDeleting(id);
      await deleteTestimonial(id);
      setTestimonials(testimonials.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Failed to delete testimonial:', error);
      alert('Failed to delete testimonial');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="max-w-6xl mx-auto w-full p-8 space-y-10">

        {/* Featured Video */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex items-center gap-3 p-6 border-b border-gray-200 bg-gray-50">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Video className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Featured Video</h2>
              <p className="text-sm text-gray-500">Shown in the Change Maker section</p>
            </div>
          </div>
          <form onSubmit={handleSaveVideo} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Video URL</label>
              <input
                type="url"
                value={featuredVideoUrl}
                onChange={(e) => setFeaturedVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video Title</label>
              <input
                type="text"
                value={featuredVideoTitle}
                onChange={(e) => setFeaturedVideoTitle(e.target.value)}
                placeholder="Enter video title..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Creator Name</label>
              <input
                type="text"
                value={featuredVideoCreator}
                onChange={(e) => setFeaturedVideoCreator(e.target.value)}
                placeholder="Enter creator name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm text-gray-900"
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isSavingVideo}
                className="px-5 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 disabled:bg-gray-400 transition"
              >
                {isSavingVideo ? 'Saving...' : 'Save Video'}
              </button>
              {videoMessage && <span className="text-sm text-green-600">{videoMessage}</span>}
            </div>
          </form>
        </div>

        {/* Testimonials List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Change Maker</h1>
            <Link
              href="/admin/testimonials/new"
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-900"
            >
              <Plus className="h-5 w-5" />
              New Testimonial
            </Link>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : testimonials.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">No testimonials yet</p>
              <Link href="/admin/testimonials/new" className="text-blue-600 hover:underline">
                Create the first testimonial
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                >
                  <div className="flex gap-6">
                    {testimonial.image && (
                      <img
                        src={testimonial.image}
                        alt={testimonial.author}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600 italic line-clamp-2 mb-2">
                        "{testimonial.quote}"
                      </p>
                      <p className="font-semibold text-gray-900">{testimonial.author}</p>
                      {testimonial.videoUrl && (
                        <p className="text-xs text-blue-600 mt-1">📹 Has video</p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Link
                        href={`/admin/testimonials/${testimonial.id}`}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                      >
                        <Edit2 className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(testimonial.id)}
                        disabled={deleting === testimonial.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
