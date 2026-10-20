'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { editorExtensions } from '@/lib/editor/extensions';
import EditorToolbar from './EditorToolbar';

interface BlockEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function BlockEditor({
  content,
  onChange,
}: BlockEditorProps): React.ReactElement {
  const editor = useEditor({
    extensions: editorExtensions,
    content: content || '<p>Start typing or use "/" for commands...</p>',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm focus:outline-none min-h-full px-8 py-6 text-base w-full',
      },
    },
  });


  if (!editor) {
    return <div className="flex items-center justify-center p-8">Loading editor...</div>;
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white">
      <EditorToolbar editor={editor} />

      <div className="relative flex-1 overflow-auto bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* Character count in bottom right */}
      <div className="border-t border-gray-200 bg-gray-50 px-8 py-3 text-xs text-gray-600">
        {editor.storage.characterCount.words()} words •{' '}
        {editor.storage.characterCount.characters()} characters
      </div>
    </div>
  );
}
