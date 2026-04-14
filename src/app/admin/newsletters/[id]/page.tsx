'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { newsletters } from '@/data/newsletters';
import type { NewsletterIssue } from '@/data/newsletters';
import NewsletterForm from '../_components/NewsletterForm';

// TODO: Replace with Firestore fetch: getNewsletterById(id)

export default function EditNewsletterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const issue = newsletters.find((n) => n.id === id);

  if (!issue) {
    return (
      <div className="flex-1 p-8 text-white">
        <p>Newsletter issue not found.</p>
      </div>
    );
  }

  const handleSave = async (data: Partial<NewsletterIssue>) => {
    // TODO: await updateNewsletter(id, data);
    console.log('Updated newsletter data:', data);
    alert('Changes saved (static mode — connect Firestore to persist).');
    router.push('/admin/newsletters');
  };

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
