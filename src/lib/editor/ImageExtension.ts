import Image from '@tiptap/extension-image';

export const ImageExtension = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: '',
        parseHTML: (element) => {
          const caption = element.getAttribute('data-caption') || '';
          const captionElement = element.nextElementSibling;
          if (captionElement?.classList.contains('image-caption')) {
            return captionElement.textContent || '';
          }
          return caption;
        },
        renderHTML: (attributes) => ({
          'data-caption': attributes.caption,
        }),
      },
    };
  },
});
