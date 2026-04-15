'use client';

import { useRouter } from 'next/navigation';
import NewsletterForm from '../_components/NewsletterForm';
import { saveNewsletter } from '@/lib/firestore';
import type { NewsletterIssue } from '@/data/newsletters';

export default function NewNewsletterPage() {
  const router = useRouter();

  const handleSave = async (data: Partial<NewsletterIssue>) => {
    await saveNewsletter(data as NewsletterIssue);
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
