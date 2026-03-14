'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTestimonials, deleteTestimonial } from '@/lib/firestore';
import { Trash2, Edit2, Plus } from 'lucide-react';
import type { Testimonial } from '@/types';

export default function TestimonialsPage(): React.ReactElement {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
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

  if (loading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="max-w-6xl mx-auto w-full p-8">
          <p className="text-gray-500">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="max-w-6xl mx-auto w-full p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Change Maker Testimonials</h1>
          <Link
            href="/admin/testimonials/new"
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-900"
          >
            <Plus className="h-5 w-5" />
            New Testimonial
          </Link>
        </div>

        {testimonials.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">No testimonials yet</p>
            <Link
              href="/admin/testimonials/new"
              className="text-blue-600 hover:underline"
            >
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
  );
}
