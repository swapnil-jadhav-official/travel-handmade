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
            <h1 className="text-2xl font-bold text-white">Newsletters</h1>
            <p className="text-gray-400 text-sm mt-1">
              Manage <em>Departures</em> newsletter issues
            </p>
          </div>
          <Link
            href="/admin/newsletters/new"
            className="flex items-center gap-2 bg-white text-black px-4 py-2 text-sm font-medium hover:bg-gray-100 transition"
          >
            <Plus className="h-4 w-4" />
            New Issue
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="w-full text-sm text-gray-300">
            <thead>
              <tr className="border-b border-gray-800 bg-white/5">
                <th className="px-4 py-3 text-left font-medium text-gray-400">Cover</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400">Issue</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400">Title</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400 hidden md:table-cell">Published</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400 hidden md:table-cell">Articles</th>
                <th className="px-4 py-3 text-right font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
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
                  <tr key={issue.id} className="hover:bg-white/5 transition">
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
                    <td className="px-4 py-3 font-mono text-gray-400">
                      #{String(issue.issueNumber).padStart(2, '0')}
                    </td>

                    {/* Title */}
                    <td className="px-4 py-3">
                      <span className="font-medium text-white">{issue.title}</span>
                      <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">
                        {issue.description}
                      </p>
                    </td>

                    {/* Published date */}
                    <td className="px-4 py-3 hidden md:table-cell text-gray-400">
                      {new Date(issue.publishedAt).toLocaleDateString('en-GB', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Article count */}
                    <td className="px-4 py-3 hidden md:table-cell text-gray-400">
                      {issue.articles.length}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/newsletter/${issue.slug}`}
                          target="_blank"
                          className="p-1.5 text-gray-400 hover:text-white transition"
                          title="View"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/newsletters/${issue.slug}`}
                          className="p-1.5 text-gray-400 hover:text-white transition"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(issue.slug)}
                          className="p-1.5 text-gray-400 hover:text-red-400 transition"
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
