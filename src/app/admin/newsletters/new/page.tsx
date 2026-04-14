'use client';

import { useRouter } from 'next/navigation';
import NewsletterForm from '../_components/NewsletterForm';
import type { NewsletterIssue } from '@/data/newsletters';

export default function NewNewsletterPage() {
  const router = useRouter();

  const handleSave = async (data: Partial<NewsletterIssue>) => {
    // TODO: Save to Firestore
    // await addNewsletter(data);
    console.log('Newsletter data to save:', data);
    alert('Newsletter saved (static mode — connect Firestore to persist).');
    router.push('/admin/newsletters');
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">New Newsletter Issue</h1>
          <p className="text-gray-400 text-sm mt-1">
            Create a new <em>Departures</em> issue. Fields marked with * are required.
          </p>
        </div>
        <NewsletterForm onSave={handleSave} />
      </div>
    </div>
  );
}
