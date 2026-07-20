"use client";

import type { ChangeEvent } from "react";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Drawer, useOverlayState } from "@heroui/react";
import { EditorialEditorShell } from "@/components/Admin/EditorialShell";
import { emptyThoughtActionState, type ThoughtActionState } from "@/server/thoughts/actionState";
import { saveThoughtAction, unpublishThoughtAction } from "@/server/thoughts/actions";
import type { Thought } from "@/server/thoughts/types";
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
    if (saveState.activeId !== documentId) {
      router.replace(`/admin/thoughts/${saveState.activeId}`);
    }
  }, [documentId, draft, router, saveState.activeId, saveState.status, settings]);

  useEffect(() => {
    setDraft(initialThought);
    setSavedDraft(initialThought);
  }, [initialThought]);

  function bind<K extends keyof Thought>(key: K) {
    return {
      value: draft[key] as string | number,
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const next =
          event.currentTarget.type === "number"
            ? Number(event.currentTarget.value)
            : event.currentTarget.value;
        setDraft((current) => ({ ...current, [key]: next }));
      },
    };
  }

  return (
    <form id="thought-editor" action={saveAction} className="grid gap-6">
          <input type="hidden" name="id" value={documentId} />
          <input type="hidden" name="slug" value={draft.slug} />
          <input type="hidden" name="excerpt" value={draft.excerpt} />
          <input type="hidden" name="publishedDate" value={draft.publishedDate} />
          <input type="hidden" name="order" value={draft.order} />
          <input type="hidden" name="featuredOrder" value={draft.featuredOrder} />
          <input type="hidden" name="featured" value={draft.featured ? "on" : "off"} />

          <EditorialEditorShell
            title={draft.title || "Untitled thought"}
            description="Document-first editing surface for draft and publish flows."
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
                <Button type="submit" name="intent" value="draft" variant="secondary" isDisabled={disabled} onPress={() => setPendingIntent("draft")}>
                  {savePending && pendingIntent === "draft" ? "Saving draft..." : "Save draft"}
                </Button>
                <Button type="submit" name="intent" value="publish" variant="primary" isDisabled={disabled} onPress={() => setPendingIntent("publish")}>
                  {savePending && pendingIntent === "publish" ? "Publishing..." : "Publish"}
                </Button>
                {hasSavedDocument ? (
                  <button
                    formAction={unpublishAction}
                    type="submit"
                    disabled={disabled}
                    onClick={() => setPendingIntent("unpublish")}
                    className="rounded-md border border-red-600/20 px-4 py-2 text-sm font-medium text-red-600 disabled:opacity-60 dark:text-red-400"
                  >
                    {unpublishPending && pendingIntent === "unpublish"
                      ? "Unpublishing..."
                      : "Unpublish"}
                  </button>
                ) : null}
              </>
            }
            canvas={
              <div className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm text-primary">
                    Title
                    <input
                      name="title"
                      required
                      aria-invalid={Boolean(saveState.fieldErrors.title)}
                      aria-describedby={saveState.fieldErrors.title ? "title-error" : undefined}
                      className="rounded-md border border-primary/15 bg-transparent px-3 py-2 text-base outline-none"
                      {...bind("title")}
                    />
                    <FieldError id="title-error" message={saveState.fieldErrors.title} />
                  </label>

                  <label className="grid gap-2 text-sm text-primary md:col-span-2">
                    Cover image URL
                    <input
                      name="coverImageUrl"
                      type="url"
                      required
                      aria-invalid={Boolean(saveState.fieldErrors.coverImageUrl)}
                      aria-describedby={saveState.fieldErrors.coverImageUrl ? "coverImageUrl-error" : undefined}
                      className="rounded-md border border-primary/15 bg-transparent px-3 py-2 text-base outline-none"
                      {...bind("coverImageUrl")}
                    />
                    <FieldError
                      id="coverImageUrl-error"
                      message={saveState.fieldErrors.coverImageUrl}
                    />
                  </label>
                </div>

                <div className="grid gap-2 text-sm text-primary">
                  <p>Content</p>
                  <TipTapEditor
                    value={draft.body}
                    onChange={(body) => setDraft((current) => ({ ...current, body }))}
                    error={saveState.fieldErrors.body}
                  />
                </div>
              </div>
            }
            settingsContent={
              <>
                <label className="grid gap-2 text-sm text-primary">
                  Slug
                  <input
                    required
                    aria-invalid={Boolean(saveState.fieldErrors.slug)}
                    className="rounded-md border border-primary/15 bg-transparent px-3 py-2 text-base outline-none"
                    {...bind("slug")}
                  />
                  <FieldError id="slug-error" message={saveState.fieldErrors.slug} />
                </label>
                <label className="grid gap-2 text-sm text-primary">
                  Excerpt
                  <textarea
                    required
                    rows={3}
                    aria-invalid={Boolean(saveState.fieldErrors.excerpt)}
                    className="rounded-md border border-primary/15 bg-transparent px-3 py-2 text-base outline-none"
                    {...bind("excerpt")}
                  />
                  <FieldError id="excerpt-error" message={saveState.fieldErrors.excerpt} />
                </label>
                <label className="grid gap-2 text-sm text-primary">
                  Publication date
                  <input
                    type="date"
                    required
                    value={draft.publishedDate.slice(0, 10)}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        publishedDate: event.currentTarget.value,
                      }))
                    }
                    className="rounded-md border border-primary/15 bg-transparent px-3 py-2 text-base outline-none"
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
                <Drawer.CloseTrigger className="button button--ghost">Cancel</Drawer.CloseTrigger>
                <Button type="submit" form="thought-editor" variant="primary">
                  Save settings
                </Button>
              </>
            }
          />
    </form>
  );
}
