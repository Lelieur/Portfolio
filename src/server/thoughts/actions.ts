"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { createPrismaContentBoundary } from "@/server/content/prismaBoundary";
import { createPrismaVersionedContentStore } from "@/server/content/boundary";
import { prisma } from "@/lib/prisma";
import { asThought, parseThoughtSettingsForm } from "./domain";
import { getThoughtDocuments } from "./queries";
import type { ThoughtActionState } from "./actionState";
import type { Thought } from "./types";
import { parseThoughtForm } from "./domain";

async function ownerOnly() {
  const session = await auth();
  return Boolean(session?.user);
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

  const parsed = parseThoughtForm(formData);
  if (!parsed.ok) {
    return {
      status: "error",
      message: "Fix the highlighted fields and try again.",
      fieldErrors: parsed.errors,
      activeId,
    };
  }

  try {
    await assertUniqueSlug(activeId, parsed.value.slug);

    const boundary = createPrismaContentBoundary<Thought>("thoughts");
    await boundary.saveDraft(activeId, parsed.value);

    const intent = formData.get("intent");
    if (intent === "publish") {
      await boundary.publish(activeId);
    }

    revalidatePath("/admin/thoughts");
    revalidatePath("/");
    revalidatePath("/thoughts");
    revalidatePath(`/thoughts/${parsed.value.slug}`);

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
    await assertUniqueSlug(id, parsed.value.slug);
    await createPrismaContentBoundary<Thought>("thoughts").saveDraft(id, {
      ...current,
      ...parsed.value,
    });

    revalidatePath("/admin/thoughts");
    revalidatePath(`/admin/thoughts/${id}`);
    revalidatePath("/");
    revalidatePath("/thoughts");

    return {
      status: "success",
      message: "Settings saved as a draft.",
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
