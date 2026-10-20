'use client';

import { use, useEffect, useState } from 'react';
import PostEditor from '@/components/admin/editor/PostEditor';
import { getPostTyped } from '@/lib/firestore';
import type { Post } from '@/types';

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): React.ReactElement {
  const { id } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async (): Promise<void> => {
      try {
        console.log('[EditPost] Fetching post with ID:', id);
        const data = await getPostTyped(id);
        console.log('[EditPost] Post fetched:', data);
        setPost(data);
      } catch (error) {
        console.error('[EditPost] Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div>Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center p-8">
        <div>Post not found</div>
      </div>
    );
  }

  return <PostEditor postId={id} initialPost={post} />;
}
