import { EMPTY_THOUGHT, type Thought } from "./types.ts";

type ThoughtErrorMap = Partial<Record<keyof Thought, string>>;

export type ThoughtFormResult =
  | { ok: true; value: Thought }
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

function requiredString(
  formData: FormData,
  name: keyof Thought,
  errors: ThoughtErrorMap
) {
  const value = formData.get(name);

  if (typeof value !== "string" || !value.trim()) {
    errors[name] = "Required";
    return "";
  }

  return value.trim();
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

function validUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validDate(value: string) {
  return !Number.isNaN(Date.parse(value));
}

export function parseThoughtForm(formData: FormData): ThoughtFormResult {
  const errors: ThoughtErrorMap = {};
  const title = requiredString(formData, "title", errors);
  const slug = requiredString(formData, "slug", errors);
  const excerpt = requiredString(formData, "excerpt", errors);
  const coverImageUrl = requiredString(formData, "coverImageUrl", errors);
  const publishedDate = requiredString(formData, "publishedDate", errors);
  const body = requiredString(formData, "body", errors);
  const order = nonNegativeInteger(formData, "order", errors);
  const featuredOrder = nonNegativeInteger(formData, "featuredOrder", errors);

  if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    errors.slug = "Use lowercase letters, numbers, and hyphens only";
  }

  if (coverImageUrl && !validUrl(coverImageUrl)) {
    errors.coverImageUrl = "Enter a valid http(s) URL";
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
      title,
      slug,
      excerpt,
      coverImageUrl,
      publishedDate,
      body,
      order,
      featured: formData.get("featured") === "on",
      featuredOrder,
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
    publishedDate: thought.publishedDate,
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

  return typeof thought.title === "string" &&
    typeof thought.slug === "string" &&
    typeof thought.excerpt === "string" &&
    typeof thought.coverImageUrl === "string" &&
    typeof thought.publishedDate === "string" &&
    typeof thought.body === "string" &&
    typeof thought.order === "number" &&
    typeof thought.featured === "boolean" &&
    typeof thought.featuredOrder === "number"
    ? (thought as Thought)
    : null;
}
