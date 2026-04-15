'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { getNewsletters, deleteNewsletter } from '@/lib/firestore';
import type { NewsletterIssue } from '@/data/newsletters';

export default function AdminNewslettersPage() {
  const [issues, setIssues] = useState<NewsletterIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNewsletters()
      .then(setIssues)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm('Delete this newsletter issue?')) return;
    await deleteNewsletter(slug);
    setIssues((prev) => prev.filter((n) => n.slug !== slug));
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-6 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Newsletters</h1>
            <p className="text-gray-600 text-sm mt-1">
              Manage <em>Departures</em> newsletter issues
            </p>
          </div>
          <Link
            href="/admin/newsletters/new"
            className="flex items-center gap-2 bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-900 transition rounded"
          >
            <Plus className="h-4 w-4" />
            New Issue
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm text-gray-700">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Cover</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Issue</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Title</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 hidden md:table-cell">Published</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 hidden md:table-cell">Articles</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                    Loading…
                  </td>
                </tr>
              ) : issues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                    No issues yet. Create the first one.
                  </td>
                </tr>
              ) : (
                issues.map((issue) => (
                  <tr key={issue.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    {/* Cover swatch */}
                    <td className="px-4 py-3">
                      <div
                        className="w-10 h-12 flex-shrink-0 rounded-sm overflow-hidden"
                        style={{ background: issue.accentColor }}
                      >
                        <img
                          src={issue.coverThumbnail}
                          alt=""
                          className="w-full h-full object-cover opacity-70"
                        />
                      </div>
                    </td>

                    {/* Issue number */}
                    <td className="px-4 py-3 font-mono text-gray-500">
                      #{String(issue.issueNumber).padStart(2, '0')}
                    </td>

                    {/* Title */}
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900">{issue.title}</span>
                      <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">
                        {issue.description}
                      </p>
                    </td>

                    {/* Published date */}
                    <td className="px-4 py-3 hidden md:table-cell text-gray-500">
                      {new Date(issue.publishedAt).toLocaleDateString('en-GB', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Article count */}
                    <td className="px-4 py-3 hidden md:table-cell text-gray-500">
                      {issue.articles.length}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/newsletter/${issue.slug}`}
                          target="_blank"
                          className="p-1.5 text-gray-400 hover:text-gray-900 transition"
                          title="View"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/newsletters/${issue.slug}`}
                          className="p-1.5 text-gray-400 hover:text-gray-900 transition"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(issue.slug)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
