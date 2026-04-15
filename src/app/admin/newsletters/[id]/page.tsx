'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getNewsletterBySlug, saveNewsletter } from '@/lib/firestore';
import type { NewsletterIssue } from '@/data/newsletters';
import NewsletterForm from '../_components/NewsletterForm';

export default function EditNewsletterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [issue, setIssue] = useState<NewsletterIssue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNewsletterBySlug(id)
      .then(setIssue)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (data: Partial<NewsletterIssue>) => {
    await saveNewsletter(data as NewsletterIssue);
    router.push('/admin/newsletters');
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 text-gray-400 text-sm">Loading…</div>
    );
  }

  if (!issue) {
    return (
      <div className="flex-1 p-8 text-white">Newsletter issue not found.</div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">
            Edit — Issue {String(issue.issueNumber).padStart(2, '0')}: {issue.title}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Editing keeps the same page layout — only content changes.
          </p>
        </div>
        <NewsletterForm initialData={issue} onSave={handleSave} />
      </div>
    </div>
  );
}
