'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2 } from 'lucide-react';
import type { NewsletterIssue, NewsletterArticleItem } from '@/data/newsletters';

// ── Reusable field wrapper ──────────────────────────────────────────────────
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'bg-white/5 border border-gray-700 text-white text-sm px-3 py-2 focus:outline-none focus:border-gray-400 transition w-full';

// ── Main form ───────────────────────────────────────────────────────────────
interface NewsletterFormProps {
  initialData?: NewsletterIssue;
  onSave: (data: Partial<NewsletterIssue>) => Promise<void>;
}

const EMPTY_ARTICLE: NewsletterArticleItem = {
  id: '',
  category: '',
  author: '',
  title: '',
  image: '',
  articleSlug: '',
};

export default function NewsletterForm({ initialData, onSave }: NewsletterFormProps) {
  const [saving, setSaving] = useState(false);

  // ── Core fields ──────────────────────────────────────────────────────────
  const [issueNumber, setIssueNumber] = useState(initialData?.issueNumber ?? 1);
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [accentColor, setAccentColor] = useState(
    initialData?.accentColor ?? '#a66200'
  );
  const [coverThumbnail, setCoverThumbnail] = useState(
    initialData?.coverThumbnail ?? ''
  );
  const [heroImage, setHeroImage] = useState(initialData?.heroImage ?? '');
  const [publishedAt, setPublishedAt] = useState(
    initialData?.publishedAt ?? new Date().toISOString().split('T')[0]
  );

  // ── Editor's letter ───────────────────────────────────────────────────────
  // Stored as newline-separated paragraphs for easy textarea editing
  const [editorLetter, setEditorLetter] = useState(
    (initialData?.editorLetterParagraphs ?? ['']).join('\n\n')
  );
  const [pullQuoteAfterIndex, setPullQuoteAfterIndex] = useState<number | ''>(
    initialData?.pullQuoteAfterIndex ?? ''
  );
  const [pullQuote, setPullQuote] = useState(initialData?.pullQuote ?? '');
  const [editorName, setEditorName] = useState(
    initialData?.editorName ?? 'Satarupa Datta'
  );
  const [editorTitle, setEditorTitle] = useState(
    initialData?.editorTitle ?? 'Founder | Editor'
  );

  // ── Articles ──────────────────────────────────────────────────────────────
  const [articles, setArticles] = useState<NewsletterArticleItem[]>(
    initialData?.articles ?? [{ ...EMPTY_ARTICLE, id: crypto.randomUUID() }]
  );

  const addArticle = () =>
    setArticles((prev) => [
      ...prev,
      { ...EMPTY_ARTICLE, id: crypto.randomUUID() },
    ]);

  const removeArticle = (id: string) =>
    setArticles((prev) => prev.filter((a) => a.id !== id));

  const updateArticle = (
    id: string,
    field: keyof NewsletterArticleItem,
    value: string
  ) =>
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = `issue-${String(issueNumber).padStart(2, '0')}`;
      await onSave({
        id: initialData?.id ?? slug,
        slug,
        issueNumber,
        title,
        description,
        accentColor,
        coverThumbnail,
        heroImage,
        pullQuoteAfterIndex: pullQuoteAfterIndex === '' ? undefined : pullQuoteAfterIndex,
        editorLetterParagraphs: editorLetter
          .split('\n\n')
          .map((p) => p.trim())
          .filter(Boolean),
        pullQuote,
        editorName,
        editorTitle,
        articles,
        publishedAt,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* ── Section: Identity ────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-white font-semibold border-b border-gray-700 pb-2">
          Issue Identity
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Issue Number" required>
            <input
              type="number"
              min={1}
              value={issueNumber}
              onChange={(e) => setIssueNumber(Number(e.target.value))}
              className={inputCls}
              required
            />
          </Field>
          <Field label="Published Date" required>
            <input
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className={inputCls}
              required
            />
          </Field>
        </div>
        <Field label="Issue Title (e.g. The Mindful Traveller)" required>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls}
            placeholder="Roads Less Taken"
            required
          />
        </Field>
        <Field label="Description (one-liner shown in listing)" required>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputCls}
            rows={2}
            required
          />
        </Field>
      </section>

      {/* ── Section: Visual ──────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-white font-semibold border-b border-gray-700 pb-2">
          Visuals
        </h2>
        <div className="grid grid-cols-2 gap-4 items-start">
          <Field label="Cover Accent Colour" required>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="h-9 w-12 border border-gray-700 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className={inputCls}
                placeholder="#a66200"
              />
            </div>
          </Field>
          <div
            className="h-20 w-28 rounded-sm border border-gray-700 overflow-hidden"
            style={{ background: accentColor }}
          >
            {coverThumbnail && (
              <img
                src={coverThumbnail}
                alt="preview"
                className="w-full h-full object-cover opacity-70"
              />
            )}
          </div>
        </div>
        <Field label="Cover Thumbnail Image URL (listing card photo)" required>
          <input
            type="text"
            value={coverThumbnail}
            onChange={(e) => setCoverThumbnail(e.target.value)}
            className={inputCls}
            placeholder="https://… or /public/…"
            required
          />
        </Field>
        <Field label="Hero Image URL (full-bleed cover on detail page)" required>
          <input
            type="text"
            value={heroImage}
            onChange={(e) => setHeroImage(e.target.value)}
            className={inputCls}
            placeholder="https://…"
            required
          />
        </Field>
      </section>

      {/* ── Section: Editor's Letter ─────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-white font-semibold border-b border-gray-700 pb-2">
          Editor&apos;s Letter
        </h2>
        <Field label="Insert pull quote after paragraph # (leave blank = after all paragraphs)">
          <input
            type="number"
            min={1}
            value={pullQuoteAfterIndex}
            onChange={(e) =>
              setPullQuoteAfterIndex(
                e.target.value === '' ? '' : Number(e.target.value)
              )
            }
            className={inputCls}
            placeholder="e.g. 4"
          />
        </Field>
        <Field label="Letter Content (separate paragraphs with a blank line)" required>
          <textarea
            value={editorLetter}
            onChange={(e) => setEditorLetter(e.target.value)}
            className={inputCls}
            rows={14}
            placeholder="First paragraph...&#10;&#10;Second paragraph..."
            required
          />
        </Field>
        <Field label="Pull Quote">
          <textarea
            value={pullQuote}
            onChange={(e) => setPullQuote(e.target.value)}
            className={inputCls}
            rows={3}
            placeholder='" A quote that represents the essence of this issue "'
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Editor Name">
            <input
              type="text"
              value={editorName}
              onChange={(e) => setEditorName(e.target.value)}
              className={inputCls}
              placeholder="Satarupa Datta"
            />
          </Field>
          <Field label="Editor Title">
            <input
              type="text"
              value={editorTitle}
              onChange={(e) => setEditorTitle(e.target.value)}
              className={inputCls}
              placeholder="Founder | Editor"
            />
          </Field>
        </div>
      </section>

      {/* ── Section: In This Issue Articles ──────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-700 pb-2">
          <h2 className="text-white font-semibold">In This Issue</h2>
          <button
            type="button"
            onClick={addArticle}
            className="flex items-center gap-1 text-sm text-gray-300 hover:text-white transition"
          >
            <Plus className="h-4 w-4" />
            Add Article
          </button>
        </div>

        {articles.map((article, idx) => (
          <div
            key={article.id}
            className="border border-gray-700 p-4 space-y-3 relative"
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs font-mono">
                Article {idx + 1}
              </span>
              {articles.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArticle(article.id)}
                  className="text-gray-500 hover:text-red-400 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Category">
                <input
                  type="text"
                  value={article.category}
                  onChange={(e) =>
                    updateArticle(article.id, 'category', e.target.value)
                  }
                  className={inputCls}
                  placeholder="TRAVEL + LIVING"
                />
              </Field>
              <Field label="Author">
                <input
                  type="text"
                  value={article.author}
                  onChange={(e) =>
                    updateArticle(article.id, 'author', e.target.value)
                  }
                  className={inputCls}
                  placeholder="Author Name"
                />
              </Field>
            </div>
            <Field label="Article Title">
              <input
                type="text"
                value={article.title}
                onChange={(e) =>
                  updateArticle(article.id, 'title', e.target.value)
                }
                className={inputCls}
                placeholder="Article title as it appears in the issue"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Image URL">
                <input
                  type="text"
                  value={article.image}
                  onChange={(e) =>
                    updateArticle(article.id, 'image', e.target.value)
                  }
                  className={inputCls}
                  placeholder="https://…"
                />
              </Field>
              <Field label="Article Slug (optional link)">
                <input
                  type="text"
                  value={article.articleSlug ?? ''}
                  onChange={(e) =>
                    updateArticle(article.id, 'articleSlug', e.target.value)
                  }
                  className={inputCls}
                  placeholder="my-article-slug"
                />
              </Field>
            </div>
          </div>
        ))}
      </section>

      {/* ── Actions ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-white text-black px-6 py-2.5 text-sm font-medium hover:bg-gray-100 transition disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Issue'}
        </button>
        <Link
          href="/admin/newsletters"
          className="text-sm text-gray-400 hover:text-white transition"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
