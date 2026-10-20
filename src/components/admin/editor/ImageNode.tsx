'use client';

import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { useState } from 'react';

interface ImageNodeProps {
  node: any;
  updateAttributes: (attrs: Record<string, any>) => void;
  selected: boolean;
}

export function ImageNode({
  node,
  updateAttributes,
  selected,
}: ImageNodeProps) {
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [captionText, setCaptionText] = useState(node.attrs.caption || '');

  const handleSaveCaption = () => {
    updateAttributes({ caption: captionText });
    setIsEditingCaption(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveCaption();
    } else if (e.key === 'Escape') {
      setIsEditingCaption(false);
      setCaptionText(node.attrs.caption || '');
    }
  };

  return (
    <NodeViewWrapper as="figure" className="my-6">
      <div
        className={`border-2 rounded-lg overflow-hidden transition-all ${
          selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
        }`}
      >
        <img
          src={node.attrs.src}
          alt={node.attrs.caption || 'Image'}
          className="w-full max-h-96 object-cover"
          draggable="false"
          data-drag-handle
        />
      </div>

      {/* Caption Editor */}
      {isEditingCaption ? (
        <textarea
          autoFocus
          value={captionText}
          onChange={(e) => setCaptionText(e.target.value)}
          onBlur={handleSaveCaption}
          onKeyDown={handleKeyDown}
          placeholder="Enter caption..."
          className="w-full px-3 py-2 mt-2 border border-blue-400 rounded text-sm bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical min-h-12"
        />
      ) : (
        <figcaption
          onClick={() => setIsEditingCaption(true)}
          className={`mt-3 text-sm cursor-text transition-all whitespace-pre-wrap break-words max-w-full ${
            node.attrs.caption
              ? 'text-gray-600 text-center italic hover:text-gray-700'
              : 'text-gray-400 text-center italic hover:text-gray-500'
          }`}
        >
          {node.attrs.caption || 'Click to add caption...'}
        </figcaption>
      )}
    </NodeViewWrapper>
  );
}
