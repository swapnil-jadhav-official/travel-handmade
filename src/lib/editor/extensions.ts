import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import CharacterCount from '@tiptap/extension-character-count';
import Youtube from '@tiptap/extension-youtube';
import Typography from '@tiptap/extension-typography';
import { ImageExtension } from './ImageExtension';

export const editorExtensions = [
  StarterKit.configure({
    paragraph: {
      HTMLAttributes: {
        class: 'text-base leading-7 text-gray-800',
      },
    },
    heading: {
      HTMLAttributes: {
        class: 'font-bold text-gray-900',
      },
    },
    bulletList: {
      HTMLAttributes: {
        class: 'list-disc list-inside space-y-2',
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: 'list-decimal list-inside space-y-2',
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: 'border-l-4 border-gray-300 pl-4 italic text-gray-600',
      },
    },
    codeBlock: {
      HTMLAttributes: {
        class: 'bg-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto',
      },
    },
    code: {
      HTMLAttributes: {
        class: 'bg-gray-100 px-2 py-1 rounded font-mono text-sm',
      },
    },
    horizontalRule: {
      HTMLAttributes: {
        class: 'my-6 border-t border-gray-300',
      },
    },
  }),

  ImageExtension.configure({
    allowBase64: false,
    inline: false,
    HTMLAttributes: {
      class: 'max-w-full transition-all duration-200',
    },
  }),

  Placeholder.configure({
    placeholder:
      "Start writing... Use the toolbar to format text, insert images, or embed videos.",
  }),

  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),

  Color.configure({
    types: ['textStyle'],
  }),

  Highlight.configure({
    multicolor: true,
  }),

  CharacterCount.configure({
    limit: null,
  }),

  Youtube.configure({
    controls: true,
    nocookie: true,
    width: 640,
    height: 360,
    HTMLAttributes: {
      class: 'w-full rounded-lg',
    },
  }),

  Typography,
];
