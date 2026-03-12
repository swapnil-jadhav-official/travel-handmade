'use client';

import { useState } from 'react';
import { seedCategories } from '@/lib/seed-categories';

export default function SetupPage(): React.ReactElement {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const handleSeedCategories = async () => {
    setLoading(true);
    setStatus(null);

    try {
      await seedCategories();
      setStatus({
        type: 'success',
        message: 'Categories seeded successfully! Redirecting to categories page...',
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = '/admin/categories';
      }, 2000);
    } catch (error) {
      setStatus({
        type: 'error',
        message: `Failed to seed categories: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-6 p-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Setup</h1>
          <p className="text-gray-600">Initialize your blog with default categories</p>
        </div>

        <div className="max-w-2xl rounded-lg border border-gray-200 bg-white p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Seed Initial Categories</h2>
            <p className="text-gray-600 mb-4">
              This will add 6 default categories to your blog. If any already exist, they will be skipped.
            </p>

            <div className="space-y-2 mb-6 rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-900">Categories that will be created:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Travel + Living</li>
                <li>• Adventure + Wildlife</li>
                <li>• Food + Drinks</li>
                <li>• Wellness</li>
                <li>• Retreats</li>
                <li>• Changemaker</li>
              </ul>
            </div>
          </div>

          {status && (
            <div
              className={`mb-6 rounded-lg p-4 ${
                status.type === 'success'
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}
            >
              {status.message}
            </div>
          )}

          <button
            onClick={handleSeedCategories}
            disabled={loading}
            className="rounded bg-black px-6 py-3 font-medium text-white hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Seeding...' : 'Seed Categories'}
          </button>
        </div>
      </div>
    </div>
  );
}
