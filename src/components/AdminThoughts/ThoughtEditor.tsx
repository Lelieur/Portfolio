"use client";

import type { ChangeEvent } from "react";
import { useActionState, useMemo, useState } from "react";
import Image from "next/image";
import { emptyThoughtActionState, type ThoughtActionState } from "@/server/thoughts/actionState";
import { saveThoughtAction, unpublishThoughtAction } from "@/server/thoughts/actions";
import type { Thought } from "@/server/thoughts/types";

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
  const [draft, setDraft] = useState(initialThought);
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
  const previewDate = useMemo(() => {
    if (!draft.publishedDate) return "Choose a date";
    const date = new Date(draft.publishedDate);
    return Number.isNaN(date.valueOf()) ? "Choose a valid date" : date.toLocaleDateString();
  }, [draft.publishedDate]);

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
    <>
      <section className="rounded-md border border-primary/15 p-5 lg:hidden">
        <h2 className="text-lg font-medium text-primary">Desktop editor only</h2>
        <p className="mt-2 text-sm text-secondary">
          Thoughts editing is available from `lg` screens and up. The list stays
          available here so you can review document status on smaller devices.
        </p>
      </section>

      <section className="hidden min-w-0 lg:block">
        <form action={saveAction} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <input type="hidden" name="id" value={documentId} />

          <div className="grid gap-6 rounded-md border border-primary/15 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-secondary">
                  Thought editor
                </p>
                <h2 className="mt-1 text-2xl font-medium text-primary">
                  {draft.title || "Untitled thought"}
                </h2>
              </div>
              <span className="rounded-full border border-primary/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-secondary">
                {status}
              </span>
            </div>

            <p aria-live="polite" className={`text-sm ${statusLabel(actionState)}`}>
              {actionState.message ?? "Draft changes stay private until you publish."}
            </p>

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

              <label className="grid gap-2 text-sm text-primary">
                Slug
                <input
                  name="slug"
                  required
                  aria-invalid={Boolean(saveState.fieldErrors.slug)}
                  aria-describedby={saveState.fieldErrors.slug ? "slug-error" : undefined}
                  className="rounded-md border border-primary/15 bg-transparent px-3 py-2 text-base outline-none"
                  {...bind("slug")}
                />
                <FieldError id="slug-error" message={saveState.fieldErrors.slug} />
              </label>

              <label className="grid gap-2 text-sm text-primary md:col-span-2">
                Excerpt
                <textarea
                  name="excerpt"
                  required
                  rows={3}
                  aria-invalid={Boolean(saveState.fieldErrors.excerpt)}
                  aria-describedby={saveState.fieldErrors.excerpt ? "excerpt-error" : undefined}
                  className="rounded-md border border-primary/15 bg-transparent px-3 py-2 text-base outline-none"
                  {...bind("excerpt")}
                />
                <FieldError id="excerpt-error" message={saveState.fieldErrors.excerpt} />
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

              <label className="grid gap-2 text-sm text-primary">
                Published date
                <input
                  name="publishedDate"
                  type="date"
                  required
                  aria-invalid={Boolean(saveState.fieldErrors.publishedDate)}
                  aria-describedby={saveState.fieldErrors.publishedDate ? "publishedDate-error" : undefined}
                  className="rounded-md border border-primary/15 bg-transparent px-3 py-2 text-base outline-none"
                  value={draft.publishedDate.slice(0, 10)}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      publishedDate: event.currentTarget.value,
                    }))
                  }
                />
                <FieldError
                  id="publishedDate-error"
                  message={saveState.fieldErrors.publishedDate}
                />
              </label>

              <label className="grid gap-2 text-sm text-primary">
                Collection order
                <input
                  name="order"
                  type="number"
                  min="0"
                  aria-invalid={Boolean(saveState.fieldErrors.order)}
                  aria-describedby={saveState.fieldErrors.order ? "order-error" : undefined}
                  className="rounded-md border border-primary/15 bg-transparent px-3 py-2 text-base outline-none"
                  {...bind("order")}
                />
                <FieldError id="order-error" message={saveState.fieldErrors.order} />
              </label>

              <label className="grid gap-2 text-sm text-primary">
                Featured order
                <input
                  name="featuredOrder"
                  type="number"
                  min="0"
                  aria-invalid={Boolean(saveState.fieldErrors.featuredOrder)}
                  aria-describedby={saveState.fieldErrors.featuredOrder ? "featuredOrder-error" : undefined}
                  className="rounded-md border border-primary/15 bg-transparent px-3 py-2 text-base outline-none"
                  {...bind("featuredOrder")}
                />
                <FieldError
                  id="featuredOrder-error"
                  message={saveState.fieldErrors.featuredOrder}
                />
              </label>

              <label className="mt-7 inline-flex items-center gap-3 text-sm text-primary">
                <input
                  name="featured"
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
            </div>

            <label className="grid gap-2 text-sm text-primary">
              Markdown body
              <textarea
                name="body"
                required
                rows={16}
                aria-invalid={Boolean(saveState.fieldErrors.body)}
                aria-describedby={saveState.fieldErrors.body ? "body-error" : undefined}
                className="rounded-md border border-primary/15 bg-transparent px-3 py-2 text-base outline-none"
                {...bind("body")}
              />
              <FieldError id="body-error" message={saveState.fieldErrors.body} />
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                name="intent"
                value="draft"
                type="submit"
                disabled={disabled}
                onClick={() => setPendingIntent("draft")}
                className="rounded-md border border-primary/15 px-4 py-2 text-sm font-medium text-primary disabled:opacity-60"
              >
                {savePending && pendingIntent === "draft" ? "Saving draft..." : "Save draft"}
              </button>
              <button
                name="intent"
                value="publish"
                type="submit"
                disabled={disabled}
                onClick={() => setPendingIntent("publish")}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-background disabled:opacity-60"
              >
                {savePending && pendingIntent === "publish" ? "Publishing..." : "Publish"}
              </button>
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
            </div>
          </div>

          <aside className="grid h-fit gap-4 rounded-md border border-primary/15 p-5">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-secondary">
                Preview
              </p>
              <h3 className="mt-2 text-xl font-medium text-primary">
                {draft.title || "Untitled thought"}
              </h3>
              <p className="mt-2 text-sm text-secondary">{previewDate}</p>
            </div>

            {draft.coverImageUrl ? (
              <Image
                src={draft.coverImageUrl}
                alt={draft.title || "Thought cover preview"}
                width={1280}
                height={720}
                unoptimized
                className="aspect-[16/9] w-full rounded-md border border-primary/15 object-cover"
              />
            ) : (
              <div className="flex aspect-[16/9] items-center justify-center rounded-md border border-dashed border-primary/15 text-sm text-secondary">
                Cover preview
              </div>
            )}

            <p className="text-sm text-secondary">{draft.excerpt || "Add an excerpt to preview it here."}</p>
            <div className="rounded-md bg-primary/5 p-4 text-sm leading-6 text-primary">
              <p className="whitespace-pre-wrap">
                {draft.body || "Body preview updates as you type."}
              </p>
            </div>
          </aside>
        </form>
      </section>
    </>
  );
}
