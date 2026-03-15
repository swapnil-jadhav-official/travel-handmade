import Image from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ImageNode } from '@/components/admin/editor/ImageNode';

export const ImageExtension = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: '',
        parseHTML: (element) => {
          return element.getAttribute('data-caption') || '';
        },
        renderHTML: (attributes) => {
          return {
            'data-caption': attributes.caption,
          };
        },
      },
      alt: {
        default: '',
        parseHTML: (element) => element.getAttribute('alt') || '',
        renderHTML: (attributes) => ({
          alt: attributes.alt,
        }),
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNode);
  },
});
