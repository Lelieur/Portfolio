"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Drawer, useOverlayState } from "@heroui/react";
import type { JSONContent } from "@tiptap/core";
import { toSlug } from "@/lib/toSlug";
import { EditorialEditorShell } from "@/components/Admin/EditorialShell";
import { emptyThoughtActionState, type ThoughtActionState } from "@/server/thoughts/actionState";
import { saveThoughtAction, unpublishThoughtAction } from "@/server/thoughts/actions";
import type { Thought, ThoughtDocument } from "@/server/thoughts/types";
import { TipTapEditor } from "./TipTapEditor";

type ThoughtEditorProps = {
  documentId: string;
  initialThought: Thought;
  hasSavedDocument: boolean;
  status: "draft" | "published" | "draft+published";
};

type PendingIntent = "draft" | "publish" | "unpublish" | null;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-sm text-red-600">
      {message}
    </p>
  );
}

function statusLabel(state: ThoughtActionState) {
  if (state.status === "success") return "text-emerald-700 dark:text-emerald-300";
  if (state.status === "error") return "text-red-600 dark:text-red-400";
  return "text-secondary";
}

function nodeText(value: unknown): string {
  if (!value || typeof value !== "object") return "";

  const node = value as JSONContent;
  if (node.type === "text") return typeof node.text === "string" ? node.text : "";

  return Array.isArray(node.content)
    ? node.content.map((child) => nodeText(child)).join(" ")
    : "";
}

function firstHeading(document: ThoughtDocument) {
  return document.content?.find(
    (node) => node.type === "heading" && Number(node.attrs?.level) === 1
  );
}

function firstImageSource(value: unknown): string {
  if (!value || typeof value !== "object") return "";

  const node = value as JSONContent;
  if (node.type === "image" && typeof node.attrs?.src === "string") {
    return node.attrs.src;
  }

  for (const child of node.content ?? []) {
    const match = firstImageSource(child);
    if (match) return match;
  }

  return "";
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

function applyDerivedFields(current: Thought, document: ThoughtDocument): Thought {
  const title = nodeText(firstHeading(document)).replace(/\s+/g, " ").trim();
  const slug = current.manualSlug !== null ? current.manualSlug : toSlug(title);
  const excerpt = current.manualExcerpt !== null ? current.manualExcerpt : excerptFromDocument(document);
  const coverImageUrl =
    current.manualCoverImageUrl !== null
      ? current.manualCoverImageUrl
      : firstImageSource(document);

  return {
    ...current,
    document,
    title,
    slug,
    excerpt,
    coverImageUrl,
  };
}

export function ThoughtEditor({
  documentId,
  initialThought,
  hasSavedDocument,
  status,
}: ThoughtEditorProps) {
  const router = useRouter();
  const settings = useOverlayState();
  const [draft, setDraft] = useState(initialThought);
  const [savedDraft, setSavedDraft] = useState(initialThought);
  const [pendingIntent, setPendingIntent] = useState<PendingIntent>(null);
  const [saveState, saveAction, savePending] = useActionState(
    saveThoughtAction,
    emptyThoughtActionState(documentId)
  );
  const [unpublishState, unpublishAction, unpublishPending] = useActionState(
    unpublishThoughtAction,
    emptyThoughtActionState(documentId)
  );
  const actionState = unpublishState.status !== "idle" ? unpublishState : saveState;
  const disabled = savePending || unpublishPending;
  const hasUnsavedChanges = JSON.stringify(draft) !== JSON.stringify(savedDraft);

  useEffect(() => {
    if (saveState.status !== "success" || !saveState.activeId) return;

    setSavedDraft(draft);
    settings.close();

    router.replace(`/admin/thoughts/${saveState.activeId}`);

    router.refresh();
  }, [documentId, draft, router, saveState.activeId, saveState.status, settings]);

  useEffect(() => {
    setDraft(initialThought);
    setSavedDraft(initialThought);
  }, [initialThought]);

  return (
    <form id="thought-editor" action={saveAction} className="grid gap-6">
      <input type="hidden" name="id" value={documentId} />
      <input type="hidden" name="manualSlug" value={draft.manualSlug ?? ""} />
      <input type="hidden" name="manualExcerpt" value={draft.manualExcerpt ?? ""} />
      <input
        type="hidden"
        name="manualCoverImageUrl"
        value={draft.manualCoverImageUrl ?? ""}
      />
      <input type="hidden" name="publishedDate" value={draft.publishedDate} />
      <input type="hidden" name="order" value={draft.order} />
      <input type="hidden" name="featuredOrder" value={draft.featuredOrder} />
      <input type="hidden" name="featured" value={draft.featured ? "on" : "off"} />

      <EditorialEditorShell
        title={draft.title || "Untitled thought"}
        description="The first H1 in the document is the title source of truth."
        status={status}
        message={
          <span className={statusLabel(actionState)}>
            {actionState.message ?? "Draft changes stay private until you publish."}
          </span>
        }
        hasUnsavedChanges={hasUnsavedChanges && !disabled}
        settings={settings}
        settingsTitle="Thought settings"
        actions={
          <>
            <Button
              type="submit"
              name="intent"
              value="draft"
              variant="secondary"
              className="editorial-control"
              isDisabled={disabled}
              onPress={() => setPendingIntent("draft")}
            >
              {savePending && pendingIntent === "draft" ? "Saving draft..." : "Save draft"}
            </Button>
            <Button
              type="submit"
              name="intent"
              value="publish"
              variant="primary"
              className="editorial-control bg-primary text-background"
              isDisabled={disabled}
              onPress={() => setPendingIntent("publish")}
            >
              {savePending && pendingIntent === "publish" ? "Publishing..." : "Publish"}
            </Button>
            {hasSavedDocument ? (
              <button
                formAction={unpublishAction}
                type="submit"
                disabled={disabled}
                onClick={() => setPendingIntent("unpublish")}
                className="editorial-control editorial-control--danger"
              >
                {unpublishPending && pendingIntent === "unpublish"
                  ? "Unpublishing..."
                  : "Unpublish"}
              </button>
            ) : null}
          </>
        }
        canvas={
          <div className="grid gap-4">
            <div className="grid gap-2 text-sm text-secondary">
              <p>Content</p>
              <p>
                The first <code>H1</code> becomes the title. The first image becomes
                the default cover.
              </p>
            </div>
            <TipTapEditor
              value={draft.document}
              onChange={(document) =>
                setDraft((current) => applyDerivedFields(current, document))
              }
              error={saveState.fieldErrors.body}
            />
            <FieldError id="title-error" message={saveState.fieldErrors.title} />
          </div>
        }
        settingsContent={
          <>
            <label className="grid gap-2 text-sm text-primary">
              Slug
              <input
                value={draft.manualSlug ?? draft.slug}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    manualSlug: event.currentTarget.value,
                    slug: event.currentTarget.value,
                  }))
                }
                aria-invalid={Boolean(saveState.fieldErrors.slug)}
                className="rounded-md border border-primary/15 bg-transparent px-3 py-2 text-base outline-none"
              />
              <p className="text-xs text-secondary">
                Leave it untouched to keep following the document title.
              </p>
              <FieldError id="slug-error" message={saveState.fieldErrors.slug} />
            </label>
            <label className="grid gap-2 text-sm text-primary">
              Excerpt
              <textarea
                rows={3}
                value={draft.manualExcerpt ?? draft.excerpt}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    manualExcerpt: event.currentTarget.value,
                    excerpt: event.currentTarget.value,
                  }))
                }
                aria-invalid={Boolean(saveState.fieldErrors.excerpt)}
                className="rounded-md border border-primary/15 bg-transparent px-3 py-2 text-base outline-none"
              />
              <p className="text-xs text-secondary">
                Leave it untouched to keep following the document content.
              </p>
              <FieldError id="excerpt-error" message={saveState.fieldErrors.excerpt} />
            </label>
            <label className="grid gap-2 text-sm text-primary">
              Cover image URL
              <input
                type="text"
                value={draft.manualCoverImageUrl ?? draft.coverImageUrl}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    manualCoverImageUrl: event.currentTarget.value,
                    coverImageUrl: event.currentTarget.value,
                  }))
                }
                aria-invalid={Boolean(saveState.fieldErrors.coverImageUrl)}
                className="rounded-md border border-primary/15 bg-transparent px-3 py-2 text-base outline-none"
              />
              <p className="text-xs text-secondary">
                Leave it untouched to keep following the first document image.
              </p>
              <FieldError
                id="coverImageUrl-error"
                message={saveState.fieldErrors.coverImageUrl}
              />
            </label>
            <label className="grid gap-2 text-sm text-primary">
              Publication date
              <input
                type="date"
                value={draft.publishedDate.slice(0, 10)}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    publishedDate: event.currentTarget.value,
                  }))
                }
                className="rounded-md border border-primary/15 bg-transparent px-3 py-2 text-base outline-none"
              />
              <p className="text-xs text-secondary">
                Leave empty to auto-fill the first time this is published.
              </p>
              <FieldError
                id="publishedDate-error"
                message={saveState.fieldErrors.publishedDate}
              />
            </label>
            <label className="inline-flex items-center gap-3 text-sm text-primary">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    featured: event.currentTarget.checked,
                  }))
                }
              />
              Featured on homepage
            </label>
            <p className="text-sm text-secondary">
              Collection and featured ordering stay in the list view.
            </p>
          </>
        }
        settingsFooter={
          <>
            <Drawer.CloseTrigger className="editorial-control">Cancel</Drawer.CloseTrigger>
            <Button type="submit" form="thought-editor" className="editorial-control bg-primary text-background">
              Save settings
            </Button>
          </>
        }
      />
    </form>
  );
}
