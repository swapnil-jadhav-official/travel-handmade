'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTravellers, deleteTraveller } from '@/lib/firestore';
import { Trash2, Edit2, Plus } from 'lucide-react';
import type { Traveller } from '@/types';

export default function TravellersPage(): React.ReactElement {
  const [travellers, setTravellers] = useState<Traveller[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchTravellers();
  }, []);

  const fetchTravellers = async () => {
    try {
      setLoading(true);
      const data = await getTravellers();
      setTravellers(data);
    } catch (error) {
      console.error('Failed to fetch travellers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this traveller?')) return;

    try {
      setDeleting(id);
      await deleteTraveller(id);
      setTravellers(travellers.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Failed to delete traveller:', error);
      alert('Failed to delete traveller');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="max-w-6xl mx-auto w-full p-8">
          <p className="text-gray-500">Loading travellers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="max-w-6xl mx-auto w-full p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Travellers</h1>
          <Link
            href="/admin/travellers/new"
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-900"
          >
            <Plus className="h-5 w-5" />
            New Traveller
          </Link>
        </div>

        {travellers.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">No travellers yet</p>
            <Link
              href="/admin/travellers/new"
              className="text-blue-600 hover:underline"
            >
              Create the first traveller
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {travellers.map((traveller) => (
              <div
                key={traveller.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
              >
                <div className="flex gap-6">
                  {traveller.image && (
                    <img
                      src={traveller.image}
                      alt={traveller.traveller_name}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{traveller.traveller_name}</p>
                    <p className="text-sm text-gray-600">{traveller.country}</p>
                    <p className="text-xs text-gray-500 mt-1">Slug: {traveller.slug}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link
                      href={`/admin/travellers/${traveller.id}`}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    >
                      <Edit2 className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(traveller.id)}
                      disabled={deleting === traveller.id}
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
