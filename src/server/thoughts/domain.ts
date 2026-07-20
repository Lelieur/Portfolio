import type { JSONContent } from "@tiptap/core";
import { toSlug } from "../../lib/toSlug.ts";
import {
  EMPTY_THOUGHT,
  EMPTY_THOUGHT_DOCUMENT,
  type Thought,
  type ThoughtDocument,
} from "./types.ts";

type ThoughtErrorMap = Partial<Record<keyof Thought, string>>;

export type ThoughtFormResult =
  | { ok: true; value: Thought }
  | { ok: false; errors: ThoughtErrorMap };

export type ThoughtSettings = Pick<
  Thought,
  "manualSlug" | "manualExcerpt" | "manualCoverImageUrl" | "publishedDate" | "featured"
>;

export type ThoughtSettingsFormResult =
  | { ok: true; value: ThoughtSettings }
  | { ok: false; errors: ThoughtErrorMap };

export type ThoughtSummary = {
  title: string;
  excerpt: string;
  slug: string;
  publishedDate: string;
  updatedAtLabel: string;
  status: "draft" | "published" | "draft+published";
  featured: boolean;
};

function optionalString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function nonNegativeInteger(
  formData: FormData,
  name: "order" | "featuredOrder",
  errors: ThoughtErrorMap
) {
  const raw = formData.get(name);
  const value = Number(raw ?? 0);

  if (!Number.isInteger(value) || value < 0) {
    errors[name] = "Must be a non-negative integer";
    return 0;
  }

  return value;
}

function validDate(value: string) {
  return !Number.isNaN(Date.parse(value));
}

function validImageSource(value: string) {
  return (
    /^https?:\/\//.test(value) ||
    value.startsWith("/") ||
    /^data:image\//.test(value)
  );
}

function sanitizeLinkHref(value: unknown) {
  if (typeof value !== "string") return null;

  if (
    /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(value) &&
    !/^javascript:/i.test(value)
  ) {
    return value;
  }

  return null;
}

function sanitizeTextAlign(value: unknown) {
  return value === "left" ||
    value === "center" ||
    value === "right" ||
    value === "justify"
    ? value
    : null;
}

function sanitizeMarks(value: unknown): JSONContent["marks"] {
  if (!Array.isArray(value)) return undefined;

  const marks = value.flatMap((mark) => {
    if (!mark || typeof mark !== "object") return [];
    const candidate = mark as JSONContent;

    switch (candidate.type) {
      case "bold":
      case "italic":
      case "strike":
      case "code":
      case "underline":
      case "subscript":
      case "superscript":
        return [{ type: candidate.type }];
      case "highlight": {
        return [{ type: "highlight" }];
      }
      case "link": {
        const href = sanitizeLinkHref(candidate.attrs?.href);
        if (!href) return [];

        return [
          {
            type: "link",
            attrs: {
              href,
              target:
                candidate.attrs?.target === "_blank" ? "_blank" : undefined,
              rel: "noopener noreferrer nofollow",
            },
          },
        ];
      }
      default:
        return [];
    }
  });

  return marks.length > 0 ? marks : undefined;
}

function sanitizeThoughtNode(value: unknown): ThoughtDocument | null {
  if (!value || typeof value !== "object") return null;

  const node = value as JSONContent;
  const content = Array.isArray(node.content)
    ? node.content
        .map((child) => sanitizeThoughtNode(child))
        .filter((child): child is ThoughtDocument => child !== null)
    : undefined;

  switch (node.type) {
    case "doc":
      return {
        type: "doc",
        content:
          content && content.length > 0
            ? content
            : structuredClone(EMPTY_THOUGHT_DOCUMENT.content ?? []),
      };
    case "paragraph":
      return {
        type: "paragraph",
        attrs: { textAlign: sanitizeTextAlign(node.attrs?.textAlign) },
        content,
      };
    case "heading": {
      const level = Number(node.attrs?.level);
      return {
        type: "heading",
        attrs: {
          level: level >= 1 && level <= 6 ? level : 1,
          textAlign: sanitizeTextAlign(node.attrs?.textAlign),
        },
        content,
      };
    }
    case "bulletList":
    case "orderedList":
    case "listItem":
    case "blockquote":
    case "codeBlock":
      return { type: node.type, content };
    case "taskList":
      return { type: "taskList", content };
    case "taskItem":
      return {
        type: "taskItem",
        attrs: { checked: node.attrs?.checked === true },
        content,
      };
    case "horizontalRule":
      return { type: "horizontalRule" };
    case "image": {
      const src = typeof node.attrs?.src === "string" ? node.attrs.src : "";
      if (!src || !validImageSource(src)) return null;

      return {
        type: "image",
        attrs: {
          src,
          alt: typeof node.attrs?.alt === "string" ? node.attrs.alt : "",
          title: typeof node.attrs?.title === "string" ? node.attrs.title : "",
        },
      };
    }
    case "text":
      return typeof node.text === "string"
        ? {
            type: "text",
            text: node.text,
            marks: sanitizeMarks(node.marks),
          }
        : null;
    default:
      return content && content.length > 0
        ? { type: "paragraph", attrs: { textAlign: null }, content }
        : null;
  }
}

function sanitizeThoughtDocument(value: unknown): ThoughtDocument {
  const document = sanitizeThoughtNode(value);
  return document?.type === "doc" ? document : structuredClone(EMPTY_THOUGHT_DOCUMENT);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function textAlignStyle(value: unknown) {
  const align = sanitizeTextAlign(value);
  return align ? ` style="text-align:${align}"` : "";
}

function renderMarks(text: string, marks: JSONContent["marks"]) {
  return (marks ?? []).reduce((content, mark) => {
    switch (mark.type) {
      case "bold":
        return `<strong>${content}</strong>`;
      case "italic":
        return `<em>${content}</em>`;
      case "strike":
        return `<s>${content}</s>`;
      case "code":
        return `<code>${content}</code>`;
      case "underline":
        return `<u>${content}</u>`;
      case "subscript":
        return `<sub>${content}</sub>`;
      case "superscript":
        return `<sup>${content}</sup>`;
      case "highlight":
        return `<mark>${content}</mark>`;
      case "link": {
        const href = typeof mark.attrs?.href === "string" ? mark.attrs.href : "#";
        const target =
          mark.attrs?.target === "_blank" ? ` target="${mark.attrs.target}"` : "";
        return `<a href="${escapeHtml(href)}"${target} rel="noopener noreferrer nofollow">${content}</a>`;
      }
      default:
        return content;
    }
  }, text);
}

function renderContent(content: JSONContent[] | undefined): string {
  return (content ?? []).map((node) => renderNode(node)).join("");
}

function renderNode(node: JSONContent): string {
  switch (node.type) {
    case "doc":
      return renderContent(node.content);
    case "paragraph":
      return `<p${textAlignStyle(node.attrs?.textAlign)}>${renderContent(node.content)}</p>`;
    case "heading": {
      const level = Number(node.attrs?.level);
      const tag = level >= 1 && level <= 6 ? `h${level}` : "h1";
      return `<${tag}${textAlignStyle(node.attrs?.textAlign)}>${renderContent(node.content)}</${tag}>`;
    }
    case "bulletList":
      return `<ul>${renderContent(node.content)}</ul>`;
    case "orderedList":
      return `<ol>${renderContent(node.content)}</ol>`;
    case "listItem":
      return `<li>${renderContent(node.content)}</li>`;
    case "taskList":
      return `<ul data-type="taskList">${renderContent(node.content)}</ul>`;
    case "taskItem":
      return `<li data-type="taskItem" data-checked="${node.attrs?.checked === true ? "true" : "false"}">${renderContent(node.content)}</li>`;
    case "blockquote":
      return `<blockquote>${renderContent(node.content)}</blockquote>`;
    case "codeBlock":
      return `<pre><code>${renderContent(node.content)}</code></pre>`;
    case "horizontalRule":
      return "<hr />";
    case "image": {
      const src = typeof node.attrs?.src === "string" ? node.attrs.src : "";
      const alt = typeof node.attrs?.alt === "string" ? node.attrs.alt : "";
      const title = typeof node.attrs?.title === "string" ? node.attrs.title : "";
      return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}"${title ? ` title="${escapeHtml(title)}"` : ""} />`;
    }
    case "text":
      return renderMarks(escapeHtml(typeof node.text === "string" ? node.text : ""), node.marks);
    default:
      return renderContent(node.content);
  }
}

function nodeText(value: unknown): string {
  if (!value || typeof value !== "object") return "";

  const node = value as JSONContent;
  if (node.type === "text") return typeof node.text === "string" ? node.text : "";

  return Array.isArray(node.content)
    ? node.content.map((child) => nodeText(child)).join(" ")
    : "";
}

function extractThoughtTitle(document: ThoughtDocument) {
  const heading = document.content?.find(
    (node) => node.type === "heading" && Number(node.attrs?.level) === 1
  );

  return nodeText(heading).replace(/\s+/g, " ").trim();
}

function excerptFromDocument(document: ThoughtDocument) {
  const text = (document.content ?? [])
    .filter((node, index) => !(index === 0 && node.type === "heading" && Number(node.attrs?.level) === 1))
    .map((node) => nodeText(node))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= 180) return text;

  const shortened = text.slice(0, 180);
  return shortened.slice(0, shortened.lastIndexOf(" ")).trim() || shortened.trim();
}

function firstImageSource(value: unknown): string {
  if (!value || typeof value !== "object") return "";

  const node = value as JSONContent;
  if (node.type === "image" && typeof node.attrs?.src === "string") {
    return validImageSource(node.attrs.src) ? node.attrs.src : "";
  }

  for (const child of node.content ?? []) {
    const match = firstImageSource(child);
    if (match) return match;
  }

  return "";
}

function legacyBodyToDocument(title: string, body: string): ThoughtDocument {
  const blocks = body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .map((paragraph) => ({
      type: "paragraph" as const,
      attrs: { textAlign: null },
      content: [{ type: "text" as const, text: paragraph }],
    }));

  return sanitizeThoughtDocument({
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1, textAlign: null },
        content: title ? [{ type: "text", text: title }] : undefined,
      },
      ...(blocks.length > 0 ? blocks : [{ type: "paragraph", attrs: { textAlign: null } }]),
    ],
  });
}

function materializeThought(seed: {
  document: ThoughtDocument;
  manualSlug: string | null;
  manualExcerpt: string | null;
  manualCoverImageUrl: string | null;
  publishedDate: string;
  order: number;
  featured: boolean;
  featuredOrder: number;
  lastPublicUpdate: string | null;
}): Thought {
  const document = sanitizeThoughtDocument(seed.document);
  const title = extractThoughtTitle(document);
  const slug = seed.manualSlug ?? toSlug(title);
  const excerpt = seed.manualExcerpt ?? excerptFromDocument(document);
  const coverImageUrl = seed.manualCoverImageUrl ?? firstImageSource(document);

  return {
    title,
    slug,
    excerpt,
    coverImageUrl,
    publishedDate: seed.publishedDate,
    body: renderNode(document),
    document,
    manualSlug: seed.manualSlug,
    manualExcerpt: seed.manualExcerpt,
    manualCoverImageUrl: seed.manualCoverImageUrl,
    lastPublicUpdate: seed.lastPublicUpdate,
    order: seed.order,
    featured: seed.featured,
    featuredOrder: seed.featuredOrder,
  };
}

export function parseThoughtForm(
  formData: FormData,
  previous?: Pick<Thought, "lastPublicUpdate"> | null
): ThoughtFormResult {
  const errors: ThoughtErrorMap = {};
  const serializedDocument = optionalString(formData, "document");
  let document = structuredClone(EMPTY_THOUGHT_DOCUMENT);

  if (!serializedDocument) {
    errors.body = "Document content is required";
  } else {
    try {
      document = sanitizeThoughtDocument(JSON.parse(serializedDocument));
    } catch {
      errors.body = "Document content is invalid";
    }
  }

  const manualSlug = optionalString(formData, "manualSlug") || null;
  const manualExcerpt = optionalString(formData, "manualExcerpt") || null;
  const manualCoverImageUrl = optionalString(formData, "manualCoverImageUrl") || null;
  const publishedDate = optionalString(formData, "publishedDate");
  const order = nonNegativeInteger(formData, "order", errors);
  const featuredOrder = nonNegativeInteger(formData, "featuredOrder", errors);

  if (manualSlug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(manualSlug)) {
    errors.slug = "Use lowercase letters, numbers, and hyphens only";
  }

  if (manualCoverImageUrl && !validImageSource(manualCoverImageUrl)) {
    errors.coverImageUrl = "Enter a valid image URL";
  }

  if (publishedDate && !validDate(publishedDate)) {
    errors.publishedDate = "Enter a valid date";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: materializeThought({
      document,
      manualSlug,
      manualExcerpt,
      manualCoverImageUrl,
      publishedDate,
      order,
      featured: formData.get("featured") === "on",
      featuredOrder,
      lastPublicUpdate: previous?.lastPublicUpdate ?? null,
    }),
  };
}

export function parseThoughtSettingsForm(
  formData: FormData
): ThoughtSettingsFormResult {
  const errors: ThoughtErrorMap = {};
  const manualSlug = optionalString(formData, "manualSlug") || null;
  const manualExcerpt = optionalString(formData, "manualExcerpt") || null;
  const manualCoverImageUrl = optionalString(formData, "manualCoverImageUrl") || null;
  const publishedDate = optionalString(formData, "publishedDate");

  if (manualSlug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(manualSlug)) {
    errors.slug = "Use lowercase letters, numbers, and hyphens only";
  }

  if (manualCoverImageUrl && !validImageSource(manualCoverImageUrl)) {
    errors.coverImageUrl = "Enter a valid image URL";
  }

  if (publishedDate && !validDate(publishedDate)) {
    errors.publishedDate = "Enter a valid date";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      manualSlug,
      manualExcerpt,
      manualCoverImageUrl,
      publishedDate,
      featured: formData.get("featured") === "on",
    },
  };
}

export function prepareThoughtForPublish(
  thought: Thought,
  published: Thought | null,
  now = new Date()
): ThoughtFormResult {
  const next = {
    ...thought,
    publishedDate: thought.publishedDate || now.toISOString().slice(0, 10),
  };
  const errors: ThoughtErrorMap = {};

  if (!next.title) {
    errors.title = "Add an H1 title before publishing";
  }

  if (!next.slug) {
    errors.slug = "Add a title or set a manual slug before publishing";
  }

  if (!next.excerpt) {
    errors.excerpt = "Add content or set a manual excerpt before publishing";
  }

  if (!next.coverImageUrl) {
    errors.coverImageUrl =
      "Add a document image or set a manual cover image before publishing";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const nextComparable = JSON.stringify({ ...next, lastPublicUpdate: null });
  const publishedComparable = published
    ? JSON.stringify({ ...published, lastPublicUpdate: null })
    : null;

  return {
    ok: true,
    value: {
      ...next,
      lastPublicUpdate:
        publishedComparable !== nextComparable
          ? now.toISOString()
          : published?.lastPublicUpdate ?? next.lastPublicUpdate,
    },
  };
}

export function summarizeThoughtDocument(document: {
  draft: unknown;
  published: unknown;
  updatedAt?: Date;
}): ThoughtSummary {
  const draft = asThought(document.draft);
  const published = asThought(document.published);
  const thought = draft ?? published ?? EMPTY_THOUGHT;
  const status = draft && published ? "draft+published" : draft ? "draft" : "published";

  return {
    title: thought.title || "Untitled thought",
    excerpt: thought.excerpt || "No excerpt yet.",
    slug: thought.slug || "new-thought",
    publishedDate: thought.publishedDate || "",
    updatedAtLabel: document.updatedAt
      ? new Intl.DateTimeFormat("en", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(document.updatedAt)
      : "Not saved yet",
    status,
    featured: thought.featured,
  };
}

export function asThought(value: unknown): Thought | null {
  if (!value || typeof value !== "object") return null;

  const thought = value as Partial<Thought>;

  if (
    typeof thought.title === "string" &&
    typeof thought.slug === "string" &&
    typeof thought.excerpt === "string" &&
    typeof thought.coverImageUrl === "string" &&
    typeof thought.publishedDate === "string" &&
    typeof thought.body === "string" &&
    typeof thought.order === "number" &&
    typeof thought.featured === "boolean" &&
    typeof thought.featuredOrder === "number" &&
    (typeof thought.manualSlug === "string" || thought.manualSlug === null) &&
    (typeof thought.manualExcerpt === "string" || thought.manualExcerpt === null) &&
    (typeof thought.manualCoverImageUrl === "string" ||
      thought.manualCoverImageUrl === null) &&
    (typeof thought.lastPublicUpdate === "string" || thought.lastPublicUpdate === null)
  ) {
    return materializeThought({
      document: sanitizeThoughtDocument(thought.document),
      manualSlug: thought.manualSlug,
      manualExcerpt: thought.manualExcerpt,
      manualCoverImageUrl: thought.manualCoverImageUrl,
      publishedDate: thought.publishedDate,
      order: thought.order,
      featured: thought.featured,
      featuredOrder: thought.featuredOrder,
      lastPublicUpdate: thought.lastPublicUpdate,
    });
  }

  return typeof thought.title === "string" &&
    typeof thought.slug === "string" &&
    typeof thought.excerpt === "string" &&
    typeof thought.coverImageUrl === "string" &&
    typeof thought.publishedDate === "string" &&
    typeof thought.body === "string" &&
    typeof thought.order === "number" &&
    typeof thought.featured === "boolean" &&
    typeof thought.featuredOrder === "number"
    ? materializeThought({
        document: legacyBodyToDocument(thought.title, thought.body),
        manualSlug: thought.slug || null,
        manualExcerpt: thought.excerpt || null,
        manualCoverImageUrl: thought.coverImageUrl || null,
        publishedDate: thought.publishedDate,
        order: thought.order,
        featured: thought.featured,
        featuredOrder: thought.featuredOrder,
        lastPublicUpdate: null,
      })
    : null;
}
