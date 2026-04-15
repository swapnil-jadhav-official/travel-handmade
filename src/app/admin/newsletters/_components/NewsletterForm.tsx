'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Search, X, Check, Upload } from 'lucide-react';
import { getAllPostsTyped, getCategories } from '@/lib/firestore';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import type { Post, Category } from '@/types';
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
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'bg-white border border-gray-300 text-gray-900 text-sm px-3 py-2 focus:outline-none focus:border-gray-500 transition w-full rounded';

// ── Image Upload Field ──────────────────────────────────────────────────────
function ImageUploadField({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      onChange(url);
    } catch {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Preview */}
      {value && (
        <div className="relative w-full h-40 rounded overflow-hidden border border-gray-200 bg-gray-50">
          <img src={value} alt="preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow text-gray-500 hover:text-red-500 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Upload + URL row */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50 text-gray-700 transition disabled:opacity-50 flex-shrink-0"
        >
          {uploading ? (
            <div className="h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="or paste URL…"
          className="bg-white border border-gray-300 text-gray-900 text-sm px-3 py-2 focus:outline-none focus:border-gray-500 transition flex-1 rounded"
        />
      </div>

      <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
    </div>
  );
}

// ── Post Selector ───────────────────────────────────────────────────────────
function PostSelector({
  posts,
  categories,
  selectedPostId,
  onSelect,
  onClear,
}: {
  posts: Post[];
  categories: Category[];
  selectedPostId?: string;
  onSelect: (post: Post) => void;
  onClear: () => void;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedPost = posts.find((p) => p.id === selectedPostId);

  const filtered = query.trim()
    ? posts.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        (p.authorName || p.author || '').toLowerCase().includes(query.toLowerCase())
      )
    : posts;

  const getCategoryName = (slug: string) =>
    categories.find((c) => c.slug === slug)?.name || slug;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {selectedPost ? (
        /* ── Selected state ── */
        <div className="flex items-center gap-3 border border-green-300 bg-green-50 rounded px-3 py-2">
          {selectedPost.featuredImage && (
            <img
              src={selectedPost.featuredImage}
              alt=""
              className="w-10 h-10 object-cover rounded flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{selectedPost.title}</p>
            <p className="text-xs text-gray-500">
              {getCategoryName(selectedPost.category)} · {selectedPost.authorName || selectedPost.author}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Check className="h-4 w-4 text-green-600" />
            <button
              type="button"
              onClick={onClear}
              className="p-0.5 text-gray-400 hover:text-red-500 transition"
              title="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        /* ── Search input ── */
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Search published posts…"
            className="bg-white border border-gray-300 text-gray-900 text-sm pl-9 pr-3 py-2 focus:outline-none focus:border-gray-500 transition w-full rounded"
          />
        </div>
      )}

      {/* ── Dropdown ── */}
      {open && !selectedPost && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-64 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-3 py-4 text-sm text-gray-500 text-center">No posts found</p>
          ) : (
            filtered.map((post) => (
              <button
                key={post.id}
                type="button"
                onClick={() => { onSelect(post); setQuery(''); setOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition text-left border-b border-gray-100 last:border-0"
              >
                {post.featuredImage ? (
                  <img src={post.featuredImage} alt="" className="w-10 h-10 object-cover rounded flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                  <p className="text-xs text-gray-500">
                    {getCategoryName(post.category)} · {post.authorName || post.author}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Track which post ID is linked to each article slot (by article.id)
  const [linkedPostIds, setLinkedPostIds] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([getAllPostsTyped(), getCategories()])
      .then(([allPosts, allCats]) => {
        setPosts(allPosts.filter((p) => p.status === 'published'));
        setCategories(allCats);
      })
      .catch(console.error);
  }, []);

  // ── Core fields ──────────────────────────────────────────────────────────
  const [issueNumber, setIssueNumber] = useState(initialData?.issueNumber ?? 1);
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [accentColor, setAccentColor] = useState(initialData?.accentColor ?? '#a66200');
  const [coverThumbnail, setCoverThumbnail] = useState(initialData?.coverThumbnail ?? '');
  const [heroImage, setHeroImage] = useState(initialData?.heroImage ?? '');
  const [publishedAt, setPublishedAt] = useState(
    initialData?.publishedAt ?? new Date().toISOString().split('T')[0]
  );

  // ── Editor's letter ──────────────────────────────────────────────────────
  const [editorLetter, setEditorLetter] = useState(
    (initialData?.editorLetterParagraphs ?? ['']).join('\n\n')
  );
  const [pullQuoteAfterIndex, setPullQuoteAfterIndex] = useState<number | ''>(
    initialData?.pullQuoteAfterIndex ?? ''
  );
  const [pullQuote, setPullQuote] = useState(initialData?.pullQuote ?? '');
  const [editorName, setEditorName] = useState(initialData?.editorName ?? 'Satarupa Datta');
  const [editorTitle, setEditorTitle] = useState(initialData?.editorTitle ?? 'Founder | Editor');

  // ── Articles ─────────────────────────────────────────────────────────────
  const [articles, setArticles] = useState<NewsletterArticleItem[]>(
    initialData?.articles ?? [{ ...EMPTY_ARTICLE, id: crypto.randomUUID() }]
  );

  const addArticle = () =>
    setArticles((prev) => [...prev, { ...EMPTY_ARTICLE, id: crypto.randomUUID() }]);

  const removeArticle = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    setLinkedPostIds((prev) => { const next = { ...prev }; delete next[id]; return next; });
  };

  const updateArticle = (id: string, field: keyof NewsletterArticleItem, value: string) =>
    setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)));

  const handlePostSelect = (articleId: string, post: Post) => {
    const getCategoryName = (slug: string) =>
      categories.find((c) => c.slug === slug)?.name || slug;

    setArticles((prev) =>
      prev.map((a) =>
        a.id === articleId
          ? {
              ...a,
              title: post.title,
              category: getCategoryName(post.category).toUpperCase(),
              author: post.authorName || post.author || '',
              image: post.featuredImage || '',
              articleSlug: post.slug,
            }
          : a
      )
    );
    setLinkedPostIds((prev) => ({ ...prev, [articleId]: post.id }));
  };

  const handlePostClear = (articleId: string) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === articleId ? { ...EMPTY_ARTICLE, id: a.id } : a))
    );
    setLinkedPostIds((prev) => { const next = { ...prev }; delete next[articleId]; return next; });
  };

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
        editorLetterParagraphs: editorLetter.split('\n\n').map((p) => p.trim()).filter(Boolean),
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
        <h2 className="text-gray-900 font-semibold border-b border-gray-200 pb-2">Issue Identity</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Issue Number" required>
            <input
              type="number" min={1} value={issueNumber}
              onChange={(e) => setIssueNumber(Number(e.target.value))}
              className={inputCls} required
            />
          </Field>
          <Field label="Published Date" required>
            <input
              type="date" value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className={inputCls} required
            />
          </Field>
        </div>
        <Field label="Issue Title (e.g. The Mindful Traveller)" required>
          <input
            type="text" value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls} placeholder="Roads Less Taken" required
          />
        </Field>
        <Field label="Description (one-liner shown in listing)" required>
          <textarea
            value={description} onChange={(e) => setDescription(e.target.value)}
            className={inputCls} rows={2} required
          />
        </Field>
      </section>

      {/* ── Section: Visual ──────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-gray-900 font-semibold border-b border-gray-200 pb-2">Visuals</h2>
        <div className="grid grid-cols-2 gap-4 items-start">
          <Field label="Cover Accent Colour" required>
            <div className="flex gap-3 items-center">
              <input
                type="color" value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="h-9 w-12 border border-gray-300 bg-transparent cursor-pointer rounded"
              />
              <input
                type="text" value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className={inputCls} placeholder="#a66200"
              />
            </div>
          </Field>
          <div
            className="h-20 w-28 rounded border border-gray-200 overflow-hidden"
            style={{ background: accentColor }}
          >
            {coverThumbnail && (
              <img src={coverThumbnail} alt="preview" className="w-full h-full object-cover opacity-70" />
            )}
          </div>
        </div>
        <ImageUploadField
          label="Cover Thumbnail (listing card photo)"
          value={coverThumbnail}
          onChange={setCoverThumbnail}
          required
        />
        <ImageUploadField
          label="Hero Image (full-bleed cover on detail page)"
          value={heroImage}
          onChange={setHeroImage}
          required
        />
      </section>

      {/* ── Section: Editor's Letter ─────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-gray-900 font-semibold border-b border-gray-200 pb-2">Editor&apos;s Letter</h2>
        <Field label="Insert pull quote after paragraph # (leave blank = after all paragraphs)">
          <input
            type="number" min={1} value={pullQuoteAfterIndex}
            onChange={(e) => setPullQuoteAfterIndex(e.target.value === '' ? '' : Number(e.target.value))}
            className={inputCls} placeholder="e.g. 4"
          />
        </Field>
        <Field label="Letter Content (separate paragraphs with a blank line)" required>
          <textarea
            value={editorLetter} onChange={(e) => setEditorLetter(e.target.value)}
            className={inputCls} rows={14}
            placeholder={"First paragraph...\n\nSecond paragraph..."} required
          />
        </Field>
        <Field label="Pull Quote">
          <textarea
            value={pullQuote} onChange={(e) => setPullQuote(e.target.value)}
            className={inputCls} rows={3}
            placeholder='" A quote that represents the essence of this issue "'
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Editor Name">
            <input
              type="text" value={editorName}
              onChange={(e) => setEditorName(e.target.value)}
              className={inputCls} placeholder="Satarupa Datta"
            />
          </Field>
          <Field label="Editor Title">
            <input
              type="text" value={editorTitle}
              onChange={(e) => setEditorTitle(e.target.value)}
              className={inputCls} placeholder="Founder | Editor"
            />
          </Field>
        </div>
      </section>

      {/* ── Section: In This Issue Articles ──────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <h2 className="text-gray-900 font-semibold">In This Issue</h2>
          <button
            type="button" onClick={addArticle}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition"
          >
            <Plus className="h-4 w-4" />
            Add Article
          </button>
        </div>

        {articles.map((article, idx) => (
          <div key={article.id} className="border border-gray-200 p-4 space-y-3 relative rounded">
            {/* Card header */}
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs font-mono">Article {idx + 1}</span>
              {articles.length > 1 && (
                <button
                  type="button" onClick={() => removeArticle(article.id)}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Post selector */}
            <Field label="Select from published posts">
              <PostSelector
                posts={posts}
                categories={categories}
                selectedPostId={linkedPostIds[article.id]}
                onSelect={(post) => handlePostSelect(article.id, post)}
                onClear={() => handlePostClear(article.id)}
              />
            </Field>

            {/* Divider */}
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-400 mb-3">Or fill in manually / override auto-filled fields below</p>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Category">
                    <input
                      type="text" value={article.category}
                      onChange={(e) => updateArticle(article.id, 'category', e.target.value)}
                      className={inputCls} placeholder="TRAVEL + LIVING"
                    />
                  </Field>
                  <Field label="Author">
                    <input
                      type="text" value={article.author}
                      onChange={(e) => updateArticle(article.id, 'author', e.target.value)}
                      className={inputCls} placeholder="Author Name"
                    />
                  </Field>
                </div>
                <Field label="Article Title">
                  <input
                    type="text" value={article.title}
                    onChange={(e) => updateArticle(article.id, 'title', e.target.value)}
                    className={inputCls} placeholder="Article title as it appears in the issue"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Image URL">
                    <input
                      type="text" value={article.image}
                      onChange={(e) => updateArticle(article.id, 'image', e.target.value)}
                      className={inputCls} placeholder="https://…"
                    />
                  </Field>
                  <Field label="Article Slug">
                    <input
                      type="text" value={article.articleSlug ?? ''}
                      onChange={(e) => updateArticle(article.id, 'articleSlug', e.target.value)}
                      className={inputCls} placeholder="my-article-slug"
                    />
                  </Field>
                </div>

                {/* Image preview */}
                {article.image && (
                  <div className="w-full h-32 rounded overflow-hidden border border-gray-200">
                    <img src={article.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ── Actions ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit" disabled={saving}
          className="bg-black text-white px-6 py-2.5 text-sm font-medium rounded hover:bg-gray-900 transition disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Issue'}
        </button>
        <Link href="/admin/newsletters" className="text-sm text-gray-500 hover:text-gray-900 transition">
          Cancel
        </Link>
      </div>
    </form>
  );
}
