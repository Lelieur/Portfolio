"use server";

import { randomUUID } from "node:crypto";
import { auth } from "@/auth";
import { createPrismaContentBoundary } from "@/server/content/prismaBoundary";
import { getThoughtDocuments } from "./queries";
import type { Thought } from "./types";

function required(formData: FormData, name: string) {
  const value = formData.get(name);
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${name} is required`);
  }

  return value.trim();
}

function number(formData: FormData, name: string) {
  const value = Number(formData.get(name) ?? 0);
  if (!Number.isInteger(value) || value < 0) throw new Error(`${name} is invalid`);
  return value;
}

async function ownerOnly() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

function thoughtFromForm(formData: FormData): Thought {
  return {
    title: required(formData, "title"),
    slug: required(formData, "slug"),
    excerpt: required(formData, "excerpt"),
    coverImageUrl: required(formData, "coverImageUrl"),
    publishedDate: required(formData, "publishedDate"),
    body: required(formData, "body"),
    order: number(formData, "order"),
    featured: formData.get("featured") === "on",
    featuredOrder: number(formData, "featuredOrder"),
  };
}

async function assertUniqueSlug(id: string, slug: string) {
  const documents = await getThoughtDocuments();
  // ponytail: application-level uniqueness; add a slug reservation table if concurrent editors matter.
  const duplicate = documents.some((document) => {
    if (document.id === id) return false;
    const draft = document.draft as Partial<Thought> | null;
    const published = document.published as Partial<Thought> | null;
    return draft?.slug === slug || published?.slug === slug;
  });

  if (duplicate) throw new Error(`Slug already exists: ${slug}`);
}

export async function saveThought(formData: FormData) {
  await ownerOnly();

  const id = typeof formData.get("id") === "string" && formData.get("id")
    ? String(formData.get("id"))
    : randomUUID();
  const thought = thoughtFromForm(formData);
  await assertUniqueSlug(id, thought.slug);

  const boundary = createPrismaContentBoundary<Thought>("thoughts");
  await boundary.saveDraft(id, thought);

  if (formData.get("intent") === "publish") await boundary.publish(id);
}

export async function unpublishThought(formData: FormData) {
  await ownerOnly();
  const id = required(formData, "id");
  await createPrismaContentBoundary<Thought>("thoughts").unpublish(id);
}
