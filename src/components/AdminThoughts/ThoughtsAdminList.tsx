"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";
import { Bars3Icon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Button, Card, Drawer, useOverlayState } from "@heroui/react";
import { EditorialSettingsDrawer } from "@/components/Admin/EditorialShell";
import { emptyThoughtActionState } from "@/server/thoughts/actionState";
import { reorderThoughtsAction, saveThoughtSettingsAction } from "@/server/thoughts/actions";

export type ThoughtListItem = {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  coverImageUrl: string;
  publishedDate: string;
  featured: boolean;
  status: "draft" | "published" | "draft+published";
  meta: string;
  href: string;
  draftHref: string;
  draftTitle?: string;
  draftExcerpt?: string;
  order: number;
  published: boolean;
};

type Filter = "published" | "draft";

const statusLabel = {
  draft: "Borrador",
  published: "Publicada",
  "draft+published": "Publicada con borrador",
};

export function ThoughtsAdminList({ items }: { items: ThoughtListItem[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("published");
  const [publishedItems, setPublishedItems] = useState(
    items.filter((item) => item.published).sort((a, b) => a.order - b.order)
  );
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<ThoughtListItem | null>(null);
  const [reorderError, setReorderError] = useState<string | null>(null);
  const [reordering, startReordering] = useTransition();
  const settings = useOverlayState();
  const [saveState, saveSettings] = useActionState(
    saveThoughtSettingsAction,
    emptyThoughtActionState("")
  );

  const drafts = items.filter((item) => item.status !== "published");
  const visibleItems = filter === "published" ? publishedItems : drafts;

  useEffect(() => {
    if (saveState.status === "success") {
      settings.close();
      router.refresh();
    }
  }, [router, saveState.status, settings]);

  function openSettings(item: ThoughtListItem) {
    setSelected(item);
    settings.open();
  }

  function moveBefore(targetId: string) {
    if (!draggedId || draggedId === targetId) return;

    const sourceIndex = publishedItems.findIndex((item) => item.id === draggedId);
    const targetIndex = publishedItems.findIndex((item) => item.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;

    const next = [...publishedItems];
    const [moved] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, moved);
    setPublishedItems(next);
    setReorderError(null);
    startReordering(() => {
      reorderThoughtsAction(next.map((item) => item.id)).catch((error) => {
        setPublishedItems(publishedItems);
        setReorderError(error instanceof Error ? error.message : "No se pudo guardar el orden.");
      });
    });
  }

  return (
    <section className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="flex items-center gap-4" aria-label="Filtrar thoughts">
          <button
            type="button"
            className={`text-sm transition ${
              filter === "published" ? "font-medium text-primary" : "text-secondary/70 hover:text-primary"
            }`}
            onClick={() => setFilter("published")}
          >
            Publicadas ({publishedItems.length})
          </button>
          <button
            type="button"
            className={`text-sm transition ${
              filter === "draft" ? "font-medium text-primary" : "text-secondary/70 hover:text-primary"
            }`}
            onClick={() => setFilter("draft")}
          >
            Borradores ({drafts.length})
          </button>
        </nav>
      </div>

      {reorderError ? <p className="text-sm text-red-600">{reorderError}</p> : null}
      {reordering ? <p className="text-sm text-secondary">Guardando orden...</p> : null}

      <div className="grid gap-3">
        {visibleItems.map((item) => (
          <Card
            key={item.id}
            variant="secondary"
            onDragOver={filter === "published" ? (event) => event.preventDefault() : undefined}
            onDrop={filter === "published" ? () => moveBefore(item.id) : undefined}
          >
            <Card.Header className="items-start gap-3">
              {filter === "published" ? (
                <button
                  type="button"
                  draggable
                  className="button button--ghost button--sm button--icon-only"
                  aria-label={`Reordenar ${item.title}`}
                  onDragStart={() => setDraggedId(item.id)}
                  onDragEnd={() => setDraggedId(null)}
                >
                  <Bars3Icon className="size-5" />
                </button>
              ) : null}
              <Link href={filter === "draft" ? item.draftHref : item.href} className="min-w-0 flex-1">
                <Card.Title className="truncate">
                  {filter === "draft" ? item.draftTitle ?? item.title : item.title}
                </Card.Title>
                <Card.Description className="mt-1 line-clamp-2">
                  {filter === "draft" ? item.draftExcerpt ?? item.excerpt : item.excerpt}
                </Card.Description>
              </Link>
              <Button
                isIconOnly
                variant="ghost"
                size="sm"
                aria-label={`Ajustes de ${item.title}`}
                onPress={() => openSettings(item)}
              >
                <EllipsisHorizontalIcon className="size-5" />
              </Button>
            </Card.Header>
            <Card.Footer className="justify-between gap-3 text-sm text-secondary">
              <span className="truncate">{item.meta}</span>
              <span className="shrink-0">{statusLabel[item.status]}</span>
            </Card.Footer>
          </Card>
        ))}
      </div>

      {visibleItems.length === 0 ? (
        <Card variant="transparent">
          <Card.Content className="text-sm text-secondary">
            No hay artículos {filter === "published" ? "publicados" : "en borrador"}.
          </Card.Content>
        </Card>
      ) : null}

      <EditorialSettingsDrawer
        state={settings}
        title="Thought settings"
        footer={
          <>
            <Drawer.CloseTrigger className="button button--ghost">Cancel</Drawer.CloseTrigger>
            <Button type="submit" form="thought-list-settings" variant="primary">
              Save settings
            </Button>
          </>
        }
      >
        <form id="thought-list-settings" action={saveSettings} className="grid gap-4">
          <input type="hidden" name="id" value={selected?.id ?? ""} />
          <label className="grid gap-2 text-sm text-primary">
            Slug
            <input
              key={selected?.id}
              name="manualSlug"
              defaultValue={selected?.slug ?? ""}
              className="rounded-lg border border-primary/15 bg-transparent px-3 py-2"
            />
            {saveState.fieldErrors.slug ? <span className="text-red-600">{saveState.fieldErrors.slug}</span> : null}
          </label>
          <label className="grid gap-2 text-sm text-primary">
            Excerpt
            <textarea
              key={`${selected?.id}-excerpt`}
              name="manualExcerpt"
              rows={3}
              defaultValue={selected?.excerpt ?? ""}
              className="rounded-lg border border-primary/15 bg-transparent px-3 py-2"
            />
            {saveState.fieldErrors.excerpt ? <span className="text-red-600">{saveState.fieldErrors.excerpt}</span> : null}
          </label>
          <label className="grid gap-2 text-sm text-primary">
            Cover image URL
            <input
              key={`${selected?.id}-cover`}
              name="manualCoverImageUrl"
              type="text"
              defaultValue={selected?.coverImageUrl ?? ""}
              className="rounded-lg border border-primary/15 bg-transparent px-3 py-2"
            />
            {saveState.fieldErrors.coverImageUrl ? (
              <span className="text-red-600">{saveState.fieldErrors.coverImageUrl}</span>
            ) : null}
          </label>
          <label className="grid gap-2 text-sm text-primary">
            Publication date
            <input
              key={`${selected?.id}-date`}
              name="publishedDate"
              type="date"
              defaultValue={selected?.publishedDate.slice(0, 10) ?? ""}
              className="rounded-lg border border-primary/15 bg-transparent px-3 py-2"
            />
          </label>
          <label className="inline-flex items-center gap-3 text-sm text-primary">
            <input
              key={`${selected?.id}-featured`}
              name="featured"
              type="checkbox"
              defaultChecked={selected?.featured ?? false}
            />
            Featured on homepage
          </label>
          {saveState.status === "error" ? <p className="text-sm text-red-600">{saveState.message}</p> : null}
        </form>
      </EditorialSettingsDrawer>
    </section>
  );
}
