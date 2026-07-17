"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type TipTapEditorProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export function TipTapEditor({ value, onChange, error }: TipTapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class: "min-h-96 rounded-md border border-primary/15 px-3 py-2 text-base leading-7 text-primary outline-none",
      },
    },
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getText()),
  });

  return (
    <div className="grid gap-2">
      <input type="hidden" name="body" value={value} />
      <div className="flex flex-wrap gap-2" aria-label="Formato del texto">
        <button
          type="button"
          className="button button--ghost button--sm"
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          Negrita
        </button>
        <button
          type="button"
          className="button button--ghost button--sm"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          Cursiva
        </button>
        <button
          type="button"
          className="button button--ghost button--sm"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          Lista
        </button>
      </div>
      <EditorContent editor={editor} />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
