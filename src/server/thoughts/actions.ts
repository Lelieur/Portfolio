"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { createPrismaContentBoundary } from "@/server/content/prismaBoundary";
import { createPrismaVersionedContentStore } from "@/server/content/boundary";
import { prisma } from "@/lib/prisma";
import {
  asThought,
  parseThoughtForm,
  parseThoughtSettingsForm,
  prepareThoughtForPublish,
} from "./domain";
import { getThoughtDocuments } from "./queries";
import type { ThoughtActionState } from "./actionState";
import type { Thought } from "./types";

async function ownerOnly() {
  const session = await auth();
  return Boolean(session?.user);
}

async function assertUniqueSlug(id: string, slug: string) {
  if (!slug) return;

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

export async function saveThoughtAction(
  _previousState: ThoughtActionState,
  formData: FormData
): Promise<ThoughtActionState> {
  const activeId =
    typeof formData.get("id") === "string" && formData.get("id")
      ? String(formData.get("id"))
      : randomUUID();

  if (!(await ownerOnly())) {
    return {
      status: "error",
      message: "You must be signed in to edit thoughts.",
      fieldErrors: {},
      activeId,
    };
  }

  const existingDocument = (await getThoughtDocuments()).find((item) => item.id === activeId);
  const publishedThought = asThought(existingDocument?.published);
  const currentThought = asThought(existingDocument?.draft) ?? publishedThought;
  const parsed = parseThoughtForm(formData, currentThought);
  if (!parsed.ok) {
    return {
      status: "error",
      message: "Fix the highlighted fields and try again.",
      fieldErrors: parsed.errors,
      activeId,
    };
  }

  try {
    const boundary = createPrismaContentBoundary<Thought>("thoughts");
    const intent = formData.get("intent");
    const nextDraft =
      intent === "publish"
        ? prepareThoughtForPublish(parsed.value, publishedThought)
        : parsed;

    if (!nextDraft.ok) {
      return {
        status: "error",
        message: "Finish the required fields before publishing.",
        fieldErrors: nextDraft.errors,
        activeId,
      };
    }

    await assertUniqueSlug(activeId, nextDraft.value.slug);
    await boundary.saveDraft(activeId, nextDraft.value);

    if (intent === "publish") {
      await boundary.publish(activeId);
    }

    revalidatePath("/admin/thoughts");
    revalidatePath("/");
    revalidatePath("/thoughts");
    if (currentThought?.slug) {
      revalidatePath(`/thoughts/${currentThought.slug}`);
    }
    if (publishedThought?.slug) {
      revalidatePath(`/thoughts/${publishedThought.slug}`);
    }
    if (nextDraft.value.slug) {
      revalidatePath(`/thoughts/${nextDraft.value.slug}`);
    }

    return {
      status: "success",
      message: intent === "publish" ? "Thought published." : "Draft saved.",
      fieldErrors: {},
      activeId,
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unable to save thought.",
      fieldErrors: {},
      activeId,
    };
  }
}

export async function unpublishThoughtAction(
  _previousState: ThoughtActionState,
  formData: FormData
): Promise<ThoughtActionState> {
  const id = typeof formData.get("id") === "string" ? String(formData.get("id")) : "";

  if (!(await ownerOnly())) {
    return {
      status: "error",
      message: "You must be signed in to edit thoughts.",
      fieldErrors: {},
      activeId: id,
    };
  }

  if (!id) {
    return {
      status: "error",
      message: "Missing thought id.",
      fieldErrors: {},
      activeId: "",
    };
  }

  try {
    await createPrismaContentBoundary<Thought>("thoughts").unpublish(id);
    revalidatePath("/admin/thoughts");
    revalidatePath("/");
    revalidatePath("/thoughts");

    return {
      status: "success",
      message: "Thought unpublished.",
      fieldErrors: {},
      activeId: id,
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unable to unpublish thought.",
      fieldErrors: {},
      activeId: id,
    };
  }
}

export async function publishThoughtFromListAction(id: string): Promise<ThoughtActionState> {
  if (!(await ownerOnly())) {
    return { status: "error", message: "You must be signed in to publish thoughts.", fieldErrors: {}, activeId: id };
  }

  const document = (await getThoughtDocuments()).find((item) => item.id === id);
  const draft = asThought(document?.draft);
  const published = asThought(document?.published);
  if (!draft) {
    return { status: "error", message: "Thought draft not found.", fieldErrors: {}, activeId: id };
  }

  const prepared = prepareThoughtForPublish(draft, published);
  if (!prepared.ok) {
    return {
      status: "error",
      message: "Complete the required settings before publishing.",
      fieldErrors: prepared.errors,
      activeId: id,
    };
  }

  try {
    await assertUniqueSlug(id, prepared.value.slug);
    const boundary = createPrismaContentBoundary<Thought>("thoughts");
    await boundary.saveDraft(id, prepared.value);
    await boundary.publish(id);
    revalidatePath("/admin/thoughts");
    revalidatePath(`/admin/thoughts/${id}`);
    revalidatePath("/");
    revalidatePath("/thoughts");
    return { status: "success", message: "Thought published.", fieldErrors: {}, activeId: id };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unable to publish thought.",
      fieldErrors: {},
      activeId: id,
    };
  }
}

export async function deleteThoughtAction(id: string) {
  if (!(await ownerOnly())) throw new Error("You must be signed in to delete thoughts.");
  await prisma.contentDocument.delete({ where: { domain_contentKey: { domain: "thoughts", contentKey: id } } });
  revalidatePath("/admin/thoughts");
  revalidatePath("/");
  revalidatePath("/thoughts");
}

export async function saveThoughtSettingsAction(
  _previousState: ThoughtActionState,
  formData: FormData
): Promise<ThoughtActionState> {
  const id = typeof formData.get("id") === "string" ? String(formData.get("id")) : "";

  if (!(await ownerOnly())) {
    return {
      status: "error",
      message: "You must be signed in to edit thoughts.",
      fieldErrors: {},
      activeId: id,
    };
  }

  const parsed = parseThoughtSettingsForm(formData);
  if (!parsed.ok) {
    return {
      status: "error",
      message: "Fix the highlighted fields and try again.",
      fieldErrors: parsed.errors,
      activeId: id,
    };
  }

  const document = (await getThoughtDocuments()).find((item) => item.id === id);
  const current = document && (asThought(document.draft) ?? asThought(document.published));
  if (!current) {
    return {
      status: "error",
      message: "Thought not found.",
      fieldErrors: {},
      activeId: id,
    };
  }

  try {
    const nextFormData = new FormData();
    nextFormData.set("document", JSON.stringify(current.document));
    nextFormData.set("manualSlug", parsed.value.manualSlug ?? "");
    nextFormData.set("manualExcerpt", parsed.value.manualExcerpt ?? "");
    nextFormData.set("manualCoverImageUrl", parsed.value.manualCoverImageUrl ?? "");
    nextFormData.set("publishedDate", parsed.value.publishedDate);
    nextFormData.set("order", String(current.order));
    nextFormData.set("featuredOrder", String(current.featuredOrder));
    nextFormData.set("featured", parsed.value.featured ? "on" : "off");

    const nextDraft = parseThoughtForm(nextFormData, current);
    if (!nextDraft.ok) {
      return {
        status: "error",
        message: "Fix the highlighted fields and try again.",
        fieldErrors: nextDraft.errors,
        activeId: id,
      };
    }

    const boundary = createPrismaContentBoundary<Thought>("thoughts");
    const intent = formData.get("intent");
    const nextValue =
      intent === "publish"
        ? prepareThoughtForPublish(nextDraft.value, asThought(document.published))
        : nextDraft;
    if (!nextValue.ok) {
      return {
        status: "error",
        message: "Complete the required settings before publishing.",
        fieldErrors: nextValue.errors,
        activeId: id,
      };
    }

    await assertUniqueSlug(id, nextValue.value.slug);
    await boundary.saveDraft(id, nextValue.value);
    if (intent === "publish") await boundary.publish(id);

    revalidatePath("/admin/thoughts");
    revalidatePath(`/admin/thoughts/${id}`);
    revalidatePath("/");
    revalidatePath("/thoughts");
    if (current.slug) {
      revalidatePath(`/thoughts/${current.slug}`);
    }
    if (nextDraft.value.slug) {
      revalidatePath(`/thoughts/${nextDraft.value.slug}`);
    }

    return {
      status: "success",
      message: intent === "publish" ? "Thought published." : "Settings saved as a draft.",
      fieldErrors: {},
      activeId: id,
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unable to save settings.",
      fieldErrors: {},
      activeId: id,
    };
  }
}

export async function reorderThoughtsAction(ids: string[]) {
  if (!(await ownerOnly())) throw new Error("You must be signed in to reorder thoughts.");

  const documents = await getThoughtDocuments();
  const published = new Map(
    documents.flatMap((document) => {
      const thought = asThought(document.published);
      return thought ? [[document.id, { document, thought }] as const] : [];
    })
  );

  if (ids.length !== published.size || new Set(ids).size !== ids.length || ids.some((id) => !published.has(id))) {
    throw new Error("The published thought list changed. Refresh and try again.");
  }

  const store = createPrismaVersionedContentStore<Thought>(prisma, "thoughts");
  await Promise.all(
    ids.map((id, order) => {
      const entry = published.get(id)!;
      const draft = asThought(entry.document.draft);
      return store.save({
        id,
        draft: draft ? { ...draft, order } : null,
        published: { ...entry.thought, order },
      });
    })
  );

  revalidatePath("/admin/thoughts");
  revalidatePath("/");
  revalidatePath("/thoughts");
}
