'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import BlockEditor from './BlockEditor';
import PostMetaPanel from './PostMetaPanel';
import PostPublishPanel from './PostPublishPanel';
import { createPostDraft, updatePostTyped, publishPost } from '@/lib/firestore';
import type { Post, PostStatus, PostVisibility } from '@/types';

interface PostEditorProps {
  postId?: string;
  initialPost?: Post;
}

// Calculate read time based on word count (assuming 200 words per minute)
const calculateReadTime = (content: string): string => {
  const wordCount = content.trim().split(/\s+/).length;
  const readTimeMinutes = Math.ceil(wordCount / 200);
  return readTimeMinutes === 1 ? '1 min read' : `${readTimeMinutes} min read`;
};

export default function PostEditor({
  postId,
  initialPost,
}: PostEditorProps): React.ReactElement {
  const router = useRouter();
  const { user, userProfile, canPublish } = useAuth();

  const [post, setPost] = useState<Partial<Post>>(
    initialPost ? { articleType: 'listicle' as const, ...initialPost } : {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      category: '',
      articleType: 'listicle' as const,
      tags: [],
      authorId: user?.uid || '',
      authorName: userProfile?.displayName || '',
      status: 'draft' as PostStatus,
      visibility: 'public' as PostVisibility,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );

  const [isDirty, setIsDirty] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<
    'idle' | 'saving' | 'saved'
  >('idle');
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);

  // Autosave effect
  useEffect(() => {
    if (!isDirty || !postId) return;

    const timer = setTimeout(async () => {
      setAutosaveStatus('saving');
      try {
        await updatePostTyped(postId, post);
        setAutosaveStatus('saved');
        setTimeout(() => setAutosaveStatus('idle'), 2000);
        setIsDirty(false);
      } catch (error) {
        console.error('Autosave failed:', error);
        setAutosaveStatus('idle');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isDirty, post, postId]);

  const handleFieldChange = useCallback(
    <K extends keyof Post>(field: K, value: Post[K]): void => {
      setPost((prev) => ({ ...prev, [field]: value }));
      setIsDirty(true);
    },
    []
  );

  // Auto-calculate read time when content changes
  useEffect(() => {
    if (post.content) {
      const readTime = calculateReadTime(post.content);
      setPost((prev) => ({ ...prev, readTime }));
    }
  }, [post.content]);

  const handleSaveDraft = async (): Promise<void> => {
    try {
      if (!postId) {
        // New post
        const newId = await createPostDraft(post as any);
        router.push(`/admin/posts/${newId}`);
      } else {
        // Update existing
        await updatePostTyped(postId, post);
        setIsDirty(false);
      }
      setAutosaveStatus('saved');
      setTimeout(() => setAutosaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save draft:', error);
      alert('Failed to save draft');
    }
  };

  const handlePublish = async (): Promise<void> => {
    try {
      console.log('[PostEditor] Publish button clicked');

      // Check role permission
      if (!canPublish()) {
        alert('Your role does not have permission to publish posts. Please ask an editor or admin.');
        return;
      }

      // Validate required fields
      if (!post.title?.trim()) {
        console.warn('[PostEditor] Validation failed: Title is empty');
        alert('Title is required');
        return;
      }
      if (!post.category) {
        console.warn('[PostEditor] Validation failed: Category is empty');
        alert('Category is required');
        return;
      }
      if (!post.excerpt?.trim()) {
        console.warn('[PostEditor] Validation failed: Excerpt is empty');
        alert('Excerpt is required');
        return;
      }
      if (!post.content?.trim()) {
        console.warn('[PostEditor] Validation failed: Content is empty');
        alert('Content is required');
        return;
      }

      console.log('[PostEditor] All validations passed');

      if (!postId) {
        // Create then publish
        console.log('[PostEditor] Creating new post before publishing...', post);
        const newId = await createPostDraft(post as any);
        console.log('[PostEditor] New post created with ID:', newId);

        console.log('[PostEditor] Now publishing post with ID:', newId);
        await publishPost(newId);
        console.log('[PostEditor] Post published successfully');

        console.log('[PostEditor] Redirecting to /admin/posts');
        router.push(`/admin/posts`);
      } else {
        console.log('[PostEditor] Publishing existing post:', postId);
        await updatePostTyped(postId, post);
        await publishPost(postId);
        console.log('[PostEditor] Post published successfully');

        console.log('[PostEditor] Redirecting to /admin/posts');
        router.push(`/admin/posts`);
      }
    } catch (error) {
      console.error('[PostEditor] FAILED TO PUBLISH POST:', error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      alert(`Failed to publish post: ${errorMsg}`);
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left Panel - Meta */}
      {showLeftPanel && (
        <div className="w-72 overflow-y-auto border-r border-gray-200">
          <PostMetaPanel
            title={post.title || ''}
            slug={post.slug || ''}
            excerpt={post.excerpt || ''}
            featuredImage={post.featuredImage}
            category={post.category || ''}
            articleType={post.articleType || 'listicle'}
            author={post.authorName || ''}
            readTime={post.readTime || ''}
            onTitleChange={(title) => handleFieldChange('title', title)}
            onSlugChange={(slug) => handleFieldChange('slug', slug)}
            onExcerptChange={(excerpt) => handleFieldChange('excerpt', excerpt)}
            onFeaturedImageChange={(url) =>
              handleFieldChange('featuredImage', url)
            }
            onFeaturedImageRemove={() => handleFieldChange('featuredImage', '')}
            onCategoryChange={(category) => handleFieldChange('category', category)}
            onArticleTypeChange={(articleType) => handleFieldChange('articleType', articleType as 'listicle' | 'visual-gallery')}
            onAuthorChange={(authorName) => handleFieldChange('authorName', authorName)}
            onReadTimeChange={(readTime) => handleFieldChange('readTime', readTime)}
            onAuthorIdChange={(authorId) => handleFieldChange('authorId', authorId)}
          />
        </div>
      )}

      {/* Center Panel - Editor */}
      <div className="flex flex-1 flex-col overflow-hidden bg-white">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => setShowLeftPanel(!showLeftPanel)}
              className="rounded p-1 hover:bg-gray-100"
              title={showLeftPanel ? 'Hide meta panel' : 'Show meta panel'}
            >
              {showLeftPanel ? (
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-600" />
              )}
            </button>
            <p className="text-sm text-gray-500">
              {autosaveStatus === 'saving'
                ? 'Saving...'
                : autosaveStatus === 'saved'
                  ? 'All changes saved'
                  : isDirty
                    ? 'Unsaved changes'
                    : ''}
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => setShowRightPanel(!showRightPanel)}
              className="rounded p-1 hover:bg-gray-100"
              title={showRightPanel ? 'Hide publish panel' : 'Show publish panel'}
            >
              {showRightPanel ? (
                <ChevronRight className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              )}
            </button>
            <button
              onClick={handleSaveDraft}
              className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              Save Draft
            </button>
            <button
              onClick={handlePublish}
              className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
            >
              {post.status === 'published' ? 'Update' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Editor */}
        <BlockEditor
          content={post.content || ''}
          onChange={(html) => handleFieldChange('content', html)}
        />
      </div>

      {/* Right Panel - Publish */}
      {showRightPanel && (
        <div className="w-80 overflow-y-auto border-l border-gray-200">
          <PostPublishPanel
            status={post.status || ('draft' as PostStatus)}
            visibility={post.visibility || ('public' as PostVisibility)}
            password={post.password}
            scheduledAt={post.scheduledAt}
            category={post.category || ''}
            tags={post.tags || []}
            seoTitle={post.seoTitle}
            seoDescription={post.seoDescription}
            wordCount={
              post.content
                ? post.content.replace(/<[^>]*>/g, '').split(/\s+/).length
                : 0
            }
            onStatusChange={(status) => handleFieldChange('status', status)}
            onVisibilityChange={(visibility) =>
              handleFieldChange('visibility', visibility)
            }
            onPasswordChange={(password) =>
              handleFieldChange('password', password)
            }
            onScheduledAtChange={(date) =>
              handleFieldChange('scheduledAt', date)
            }
            onCategoryChange={(category) => handleFieldChange('category', category)}
            onTagsChange={(tags) => handleFieldChange('tags', tags)}
            onSeoTitleChange={(title) => handleFieldChange('seoTitle', title)}
            onSeoDescriptionChange={(desc) =>
              handleFieldChange('seoDescription', desc)
            }
          />
        </div>
      )}
    </div>
  );
}
