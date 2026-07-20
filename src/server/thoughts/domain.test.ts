import assert from "node:assert/strict";
import test from "node:test";
import {
  parseThoughtForm,
  parseThoughtSettingsForm,
  prepareThoughtForPublish,
  summarizeThoughtDocument,
} from "./domain.ts";

function thoughtDocument() {
  return {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1, textAlign: null },
        content: [{ type: "text", text: "A thought" }],
      },
      {
        type: "paragraph",
        attrs: { textAlign: null },
        content: [{ type: "text", text: "Hello world from the new editor." }],
      },
      {
        type: "image",
        attrs: { src: "https://example.com/cover.jpg", alt: "Cover", title: "" },
      },
    ],
  };
}

function validFormData() {
  const formData = new FormData();
  formData.set("document", JSON.stringify(thoughtDocument()));
  formData.set("manualSlug", "");
  formData.set("manualExcerpt", "");
  formData.set("manualCoverImageUrl", "");
  formData.set("publishedDate", "2026-07-17");
  formData.set("order", "2");
  formData.set("featuredOrder", "1");
  formData.set("featured", "on");
  return formData;
}

test("parseThoughtForm derives metadata and html from the document", () => {
  const result = parseThoughtForm(validFormData());

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.title, "A thought");
    assert.equal(result.value.slug, "a-thought");
    assert.equal(result.value.coverImageUrl, "https://example.com/cover.jpg");
    assert.match(result.value.body, /<h1>A thought<\/h1>/);
    assert.equal(result.value.featured, true);
    assert.equal(result.value.order, 2);
  }
});

test("parseThoughtForm reports field errors for invalid manual overrides", () => {
  const formData = validFormData();
  formData.set("manualSlug", "Bad Slug");
  formData.set("manualCoverImageUrl", "not-a-url");
  formData.set("order", "-1");

  const result = parseThoughtForm(formData);

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.errors.slug, "Use lowercase letters, numbers, and hyphens only");
    assert.equal(result.errors.coverImageUrl, "Enter a valid image URL");
    assert.equal(result.errors.order, "Must be a non-negative integer");
  }
});

test("parseThoughtSettingsForm accepts manual override fields", () => {
  const formData = new FormData();
  formData.set("manualSlug", "custom-slug");
  formData.set("manualExcerpt", "Custom excerpt");
  formData.set("manualCoverImageUrl", "/images/custom-cover.jpg");
  formData.set("publishedDate", "2026-07-17");
  formData.set("featured", "on");

  const result = parseThoughtSettingsForm(formData);

  assert.deepEqual(result, {
    ok: true,
    value: {
      manualSlug: "custom-slug",
      manualExcerpt: "Custom excerpt",
      manualCoverImageUrl: "/images/custom-cover.jpg",
      publishedDate: "2026-07-17",
      featured: true,
    },
  });
});

test("prepareThoughtForPublish fills first publish date and stamps last public update", () => {
  const parsed = parseThoughtForm(validFormData());
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;

  const prepared = prepareThoughtForPublish(
    { ...parsed.value, publishedDate: "" },
    null,
    new Date("2026-07-20T09:30:00.000Z")
  );

  assert.equal(prepared.ok, true);
  if (prepared.ok) {
    assert.equal(prepared.value.publishedDate, "2026-07-20");
    assert.equal(prepared.value.lastPublicUpdate, "2026-07-20T09:30:00.000Z");
  }
});

test("summarizeThoughtDocument prefers draft content and exposes status", () => {
  const summary = summarizeThoughtDocument({
    draft: {
      title: "Draft title",
      slug: "draft-title",
      excerpt: "Draft excerpt",
      coverImageUrl: "https://example.com/cover.jpg",
      publishedDate: "2026-07-17",
      body: "<h1>Draft title</h1>",
      document: thoughtDocument(),
      manualSlug: null,
      manualExcerpt: null,
      manualCoverImageUrl: null,
      lastPublicUpdate: "2026-07-17T10:00:00.000Z",
      order: 0,
      featured: true,
      featuredOrder: 0,
    },
    published: {
      title: "Published title",
      slug: "published-title",
      excerpt: "Published excerpt",
      coverImageUrl: "https://example.com/live.jpg",
      publishedDate: "2026-07-01",
      body: "<h1>Published title</h1>",
      document: thoughtDocument(),
      manualSlug: "published-title",
      manualExcerpt: "Published excerpt",
      manualCoverImageUrl: "https://example.com/live.jpg",
      lastPublicUpdate: "2026-07-01T08:00:00.000Z",
      order: 1,
      featured: false,
      featuredOrder: 0,
    },
    updatedAt: new Date("2026-07-17T10:00:00.000Z"),
  });

  assert.equal(summary.title, "A thought");
  assert.equal(summary.status, "draft+published");
  assert.equal(summary.featured, true);
});
