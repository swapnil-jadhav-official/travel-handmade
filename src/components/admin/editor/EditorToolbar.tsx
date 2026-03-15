'use client';

import { Editor } from '@tiptap/react';
import { useState } from 'react';
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Image,
  Youtube,
  Minus,
} from 'lucide-react';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

interface EditorToolbarProps {
  editor: Editor;
}

const IconButton = ({
  isActive,
  onClick,
  icon: Icon,
  title,
  disabled = false,
}: {
  isActive?: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  disabled?: boolean;
}): React.ReactElement => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded transition-colors ${
      isActive
        ? 'bg-gray-200 text-black'
        : 'text-gray-600 hover:bg-gray-100'
    } disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    <Icon className="h-4 w-4" />
  </button>
);

const Separator = (): React.ReactElement => (
  <div className="h-6 w-px bg-gray-300" />
);

export default function EditorToolbar({
  editor,
}: EditorToolbarProps): React.ReactElement {
  const [uploading, setUploading] = useState(false);

  const onImageUpload = (): void => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        setUploading(true);
        try {
          // Upload to Cloudinary first
          const cloudinaryUrl = await uploadImageToCloudinary(file);
          // Prompt for caption
          const caption = prompt('Add a caption for this image (optional):');
          // Insert the image with caption
          editor
            .chain()
            .focus()
            .setImage({ src: cloudinaryUrl })
            .updateAttributes('image', { caption: caption || '' })
            .run();
        } catch (error) {
          console.error('Failed to upload image:', error);
          alert('Failed to upload image');
        } finally {
          setUploading(false);
        }
      }
    };
    input.click();
  };

  const onYoutubeEmbed = (): void => {
    const url = prompt('Paste YouTube URL:');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  return (
    <div className="sticky top-0 z-40 border-b border-gray-200 bg-white px-6 py-3">
      <div className="flex flex-wrap gap-1 rounded-lg bg-gray-50 p-2">
        {/* Undo/Redo */}
        <IconButton
          icon={Undo2}
          title="Undo (Ctrl+Z)"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        />
        <IconButton
          icon={Redo2}
          title="Redo (Ctrl+Y)"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        />

        <Separator />

        {/* Text Style */}
        <select
          value={
            editor.isActive('heading', { level: 1 })
              ? 'h1'
              : editor.isActive('heading', { level: 2 })
                ? 'h2'
                : editor.isActive('heading', { level: 3 })
                  ? 'h3'
                  : editor.isActive('blockquote')
                    ? 'blockquote'
                    : editor.isActive('codeBlock')
                      ? 'code'
                      : 'paragraph'
          }
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'h1')
              editor.chain().focus().setHeading({ level: 1 }).run();
            else if (value === 'h2')
              editor.chain().focus().setHeading({ level: 2 }).run();
            else if (value === 'h3')
              editor.chain().focus().setHeading({ level: 3 }).run();
            else if (value === 'blockquote')
              editor.chain().focus().setBlockquote().run();
            else if (value === 'code')
              editor.chain().focus().setCodeBlock().run();
            else editor.chain().focus().setParagraph().run();
          }}
          className="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 hover:bg-gray-50"
        >
          <option value="paragraph">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="blockquote">Quote</option>
          <option value="code">Code Block</option>
        </select>

        <Separator />

        {/* Formatting */}
        <IconButton
          icon={Bold}
          title="Bold (Ctrl+B)"
          isActive={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <IconButton
          icon={Italic}
          title="Italic (Ctrl+I)"
          isActive={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <IconButton
          icon={Underline}
          title="Underline (Ctrl+U)"
          isActive={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
        <IconButton
          icon={Strikethrough}
          title="Strikethrough"
          isActive={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />

        <Separator />

        {/* Link & Code */}
        <IconButton
          icon={Link}
          title="Link (Ctrl+K)"
          isActive={editor.isActive('link')}
          onClick={() => {
            const url = prompt('Enter URL:');
            if (url) {
              editor
                .chain()
                .focus()
                .toggleLink({ href: url })
                .run();
            }
          }}
        />
        <IconButton
          icon={Code}
          title="Inline Code"
          isActive={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}
        />

        <Separator />

        {/* Alignment */}
        <IconButton
          icon={AlignLeft}
          title="Align Left"
          isActive={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        />
        <IconButton
          icon={AlignCenter}
          title="Align Center"
          isActive={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        />
        <IconButton
          icon={AlignRight}
          title="Align Right"
          isActive={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        />
        <IconButton
          icon={AlignJustify}
          title="Justify"
          isActive={editor.isActive({ textAlign: 'justify' })}
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        />

        <Separator />

        {/* Lists */}
        <IconButton
          icon={List}
          title="Bullet List"
          isActive={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <IconButton
          icon={ListOrdered}
          title="Ordered List"
          isActive={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />

        <Separator />

        {/* Insert */}
        <IconButton
          icon={Image}
          title={uploading ? 'Uploading image...' : 'Insert Image'}
          onClick={onImageUpload}
          disabled={uploading}
        />
        <IconButton
          icon={Youtube}
          title="Insert YouTube Video"
          onClick={onYoutubeEmbed}
        />
        <IconButton
          icon={Minus}
          title="Insert Divider"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        />
      </div>
    </div>
  );
}
