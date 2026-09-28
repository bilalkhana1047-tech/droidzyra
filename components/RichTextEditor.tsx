'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { EditorContent, NodeViewWrapper, ReactNodeViewRenderer, useEditor, type NodeViewProps } from '@tiptap/react';
import { Node, mergeAttributes } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { supabase } from '@/lib/supabase';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

function ResizableImageView({
  node,
  updateAttributes,
  selected,
}: NodeViewProps) {
  const [resizing, setResizing] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const width = Number(node.attrs.width) || 100;
  const textAlign = node.attrs.textAlign || 'left';

  const startResize = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setResizing(true);
    startX.current = event.clientX;
    startWidth.current = width;

    const handleMove = (moveEvent: MouseEvent) => {
      const change = moveEvent.clientX - startX.current;
      const newWidth = Math.max(
        20,
        Math.min(100, startWidth.current + (change / 8))
      );

      updateAttributes({
        width: Math.round(newWidth),
      });
    };

    const handleUp = () => {
      setResizing(false);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };

  return (
    <NodeViewWrapper
      className="rich-image-node"
      style={{
        display: 'flex',
        justifyContent:
          textAlign === 'center'
            ? 'center'
            : textAlign === 'right'
              ? 'flex-end'
              : 'flex-start',
        width: '100%',
        margin: '1rem 0',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: `${width}%`,
          maxWidth: '100%',
          lineHeight: 0,
        }}
      >
        <img
          src={node.attrs.src}
          alt={node.attrs.alt || ''}
          title={node.attrs.title || ''}
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            maxWidth: '100%',
            borderRadius: '0.5rem',
            outline:
              selected
                ? '2px solid #2563eb'
                : 'none',
            outlineOffset: '2px',
            userSelect: 'none',
          }}
          draggable={false}
        />

        {selected && (
          <>
            <button
              type="button"
              onMouseDown={startResize}
              aria-label="Resize image"
              style={{
                position: 'absolute',
                right: '-7px',
                bottom: '-7px',
                width: '14px',
                height: '14px',
                padding: 0,
                border: '2px solid white',
                borderRadius: '3px',
                background: '#2563eb',
                cursor: resizing ? 'ew-resize' : 'nwse-resize',
                zIndex: 10,
              }}
            />

            <div
              style={{
                position: 'absolute',
                left: '50%',
                bottom: '-30px',
                transform: 'translateX(-50%)',
                background: '#111827',
                color: 'white',
                padding: '3px 7px',
                borderRadius: '4px',
                fontSize: '11px',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              {width}%
            </div>
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
}

const ResizableImage = Image.extend({
  name: 'image',

  addAttributes() {
    return {
      ...this.parent?.(),

      width: {
        default: 100,
        parseHTML: (element) => {
          const width = element.getAttribute('data-width');

          if (width) {
            return Number(width);
          }

          const styleWidth = element.style.width;

          if (styleWidth?.endsWith('%')) {
            return Number.parseFloat(styleWidth);
          }

          return 100;
        },
        renderHTML: (attributes) => {
          const width = Number(attributes.width) || 100;

          return {
            'data-width': String(width),
            style: `width: ${width}%; height: auto;`,
          };
        },
      },

      textAlign: {
        default: 'left',
        parseHTML: (element) =>
          element.getAttribute('data-align') || 'left',
        renderHTML: (attributes) => ({
          'data-align': attributes.textAlign || 'left',
        }),
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView);
  },
});

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      ResizableImage.configure({
        inline: false,
        allowBase64: false,
      }),
    ],
    content: value || '',
    immediatelyRender: false,

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return (
      <div className="rounded-lg border border-gray-300 bg-white p-4 text-sm text-gray-500">
        Loading editor...
      </div>
    );
  }

  const buttonClass = (active = false) =>
    `rounded border px-3 py-1.5 text-sm font-medium transition ${
      active
        ? 'bg-gray-900 text-white'
        : 'bg-white text-gray-700 hover:bg-gray-100'
    }`;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL', previousUrl || '');

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .setLink({ href: url })
      .run();
  };

  const setImageAlignment = (
    alignment: 'left' | 'center' | 'right'
  ) => {
    if (!editor.isActive('image')) {
      window.alert('First click an image to select it.');
      return;
    }

    editor
      .chain()
      .focus()
      .updateAttributes('image', {
        textAlign: alignment,
      })
      .run();
  };

  const openImagePicker = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    event.target.value = '';

    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      window.alert(
        'Please select a JPG, PNG, WEBP or GIF image.'
      );
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      window.alert('Image size must be 5 MB or smaller.');
      return;
    }

    if (!supabase) {
      window.alert(
        'Supabase is not configured. Please check your environment variables.'
      );
      return;
    }

    const selection = {
      from: editor.state.selection.from,
      to: editor.state.selection.to,
    };

    try {
      setUploadingImage(true);

      const extension =
        file.name.split('.').pop()?.toLowerCase() || 'jpg';

      const safeName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9-_]/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 80);

      const uniqueName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;

      const filePath = `content/${safeName}-${uniqueName}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from('app-content-images')
        .upload(filePath, file, {
          cacheControl: '31536000',
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('app-content-images')
        .getPublicUrl(filePath);

      if (!data.publicUrl) {
        throw new Error('Could not create public image URL.');
      }

      editor
        .chain()
        .focus()
        .setTextSelection(selection)
        .setImage({
          src: data.publicUrl,
          alt: file.name,
          width: 100,
        })
        .run();
    } catch (error) {
      console.error('Image upload failed:', error);

      window.alert(
        error instanceof Error
          ? `Image upload failed: ${error.message}`
          : 'Image upload failed.'
      );
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
      <div className="flex flex-wrap gap-2 border-b border-gray-200 bg-gray-50 p-3">
        <button
          type="button"
          className={buttonClass(
            editor.isActive('heading', { level: 1 })
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          H1
        </button>

        <button
          type="button"
          className={buttonClass(
            editor.isActive('heading', { level: 2 })
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </button>

        <button
          type="button"
          className={buttonClass(
            editor.isActive('heading', { level: 3 })
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </button>

        <button
          type="button"
          className={buttonClass(
            editor.isActive('heading', { level: 4 })
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
        >
          H4
        </button>

        <button
          type="button"
          className={buttonClass(
            editor.isActive('heading', { level: 5 })
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
        >
          H5
        </button>

        <button
          type="button"
          className={buttonClass(
            editor.isActive('heading', { level: 6 })
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
        >
          H6
        </button>

        <button
          type="button"
          className={buttonClass(editor.isActive('bold'))}
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
        >
          B
        </button>

        <button
          type="button"
          className={buttonClass(editor.isActive('italic'))}
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
        >
          I
        </button>

        <button
          type="button"
          className={buttonClass(editor.isActive('strike'))}
          onClick={() =>
            editor.chain().focus().toggleStrike().run()
          }
        >
          S
        </button>

        <button
          type="button"
          className={buttonClass(
            editor.isActive('bulletList')
          )}
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          • List
        </button>

        <button
          type="button"
          className={buttonClass(
            editor.isActive('orderedList')
          )}
          onClick={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
        >
          1. List
        </button>

        <button
          type="button"
          className={buttonClass(
            editor.isActive('blockquote')
          )}
          onClick={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
        >
          Quote
        </button>

        <button
          type="button"
          className={buttonClass()}
          onClick={setLink}
        >
          🔗 Link
        </button>

        <button
          type="button"
          className={buttonClass(
            editor.isActive('image') &&
              editor.getAttributes('image').textAlign === 'left'
          )}
          onClick={() => setImageAlignment('left')}
        >
          ⬅️ Image
        </button>

        <button
          type="button"
          className={buttonClass(
            editor.isActive('image') &&
              editor.getAttributes('image').textAlign === 'center'
          )}
          onClick={() => setImageAlignment('center')}
        >
          ↔️ Center
        </button>

        <button
          type="button"
          className={buttonClass(
            editor.isActive('image') &&
              editor.getAttributes('image').textAlign === 'right'
          )}
          onClick={() => setImageAlignment('right')}
        >
          ➡️ Image
        </button>

        <button
          type="button"
          className={buttonClass()}
          onMouseDown={(event) => event.preventDefault()}
          onClick={openImagePicker}
          disabled={uploadingImage}
        >
          {uploadingImage
            ? '⏳ Uploading...'
            : '🖼️ Image Upload'}
        </button>

        <button
          type="button"
          className={buttonClass()}
          onClick={() =>
            editor.chain().focus().undo().run()
          }
        >
          ↶ Undo
        </button>

        <button
          type="button"
          className={buttonClass()}
          onClick={() =>
            editor.chain().focus().redo().run()
          }
        >
          ↷ Redo
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleImageUpload}
        className="hidden"
      />

      <EditorContent
        editor={editor}
        className="min-h-[350px] p-4 text-sm text-gray-900 focus-within:outline-none"
      />
    </div>
  );
}



