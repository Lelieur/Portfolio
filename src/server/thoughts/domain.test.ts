import assert from "node:assert/strict";
import test from "node:test";
import { parseThoughtForm, summarizeThoughtDocument } from "./domain.ts";

function validFormData() {
  const formData = new FormData();
  formData.set("title", "A thought");
  formData.set("slug", "a-thought");
  formData.set("excerpt", "Short summary");
  formData.set("coverImageUrl", "https://example.com/cover.jpg");
  formData.set("publishedDate", "2026-07-17");
  formData.set("body", "Hello world");
  formData.set("order", "2");
  formData.set("featuredOrder", "1");
  formData.set("featured", "on");
  return formData;
}

test("parseThoughtForm returns typed content for valid input", () => {
  const result = parseThoughtForm(validFormData());

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.slug, "a-thought");
    assert.equal(result.value.featured, true);
    assert.equal(result.value.order, 2);
  }
});

test("parseThoughtForm reports field errors for invalid input", () => {
  const formData = validFormData();
  formData.set("slug", "Bad Slug");
  formData.set("coverImageUrl", "not-a-url");
  formData.set("order", "-1");

  const result = parseThoughtForm(formData);

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.errors.slug, "Use lowercase letters, numbers, and hyphens only");
    assert.equal(result.errors.coverImageUrl, "Enter a valid http(s) URL");
    assert.equal(result.errors.order, "Must be a non-negative integer");
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
      body: "Draft body",
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
      body: "Published body",
      order: 1,
      featured: false,
      featuredOrder: 0,
    },
    updatedAt: new Date("2026-07-17T10:00:00.000Z"),
  });

  assert.equal(summary.title, "Draft title");
  assert.equal(summary.status, "draft+published");
  assert.equal(summary.featured, true);
});
