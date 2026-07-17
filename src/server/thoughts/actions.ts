"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { createPrismaContentBoundary } from "@/server/content/prismaBoundary";
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
