"use client";

import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import type { ThoughtDocument } from "@/server/thoughts/types";

type TipTapEditorProps = {
  value: ThoughtDocument;
  onChange: (value: ThoughtDocument) => void;
  error?: string;
};

export function TipTapEditor({ value, onChange, error }: TipTapEditorProps) {
  return (
    <div className="grid gap-2">
      <input type="hidden" name="document" value={JSON.stringify(value)} />
      <SimpleEditor content={value} onChange={onChange} />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
