import type { JSONContent } from "@tiptap/core";

export type ThoughtDocument = JSONContent;

export type Thought = {
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string;
  publishedDate: string;
  body: string;
  document: ThoughtDocument;
  manualSlug: string | null;
  manualExcerpt: string | null;
  manualCoverImageUrl: string | null;
  lastPublicUpdate: string | null;
  order: number;
  featured: boolean;
  featuredOrder: number;
};

export const EMPTY_THOUGHT_DOCUMENT: ThoughtDocument = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1, textAlign: null },
    },
    {
      type: "paragraph",
      attrs: { textAlign: null },
    },
  ],
};

export const EMPTY_THOUGHT: Thought = {
  title: "",
  slug: "",
  excerpt: "",
  coverImageUrl: "",
  publishedDate: "",
  body: "",
  document: EMPTY_THOUGHT_DOCUMENT,
  manualSlug: null,
  manualExcerpt: null,
  manualCoverImageUrl: null,
  lastPublicUpdate: null,
  order: 0,
  featured: false,
  featuredOrder: 0,
};
