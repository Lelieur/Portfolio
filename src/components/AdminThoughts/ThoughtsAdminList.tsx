"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { Bars3Icon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Button, Card, Drawer, useOverlayState } from "@/components/ui";
import { ListFilter } from "@/components/ui/ListFilter";
import { EditorialSettingsDrawer } from "@/components/Admin/EditorialShell";
import { emptyThoughtActionState } from "@/server/thoughts/actionState";
import {
  deleteThoughtAction,
  publishThoughtFromListAction,
  reorderThoughtsAction,
  saveThoughtSettingsAction,
} from "@/server/thoughts/actions";

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
  editHref: string;
  publishable: boolean;
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
  const [deleteTarget, setDeleteTarget] = useState<ThoughtListItem | null>(null);
  const [reorderError, setReorderError] = useState<string | null>(null);
  const [reordering, startReordering] = useTransition();
  const settings = useOverlayState();
  const [saveState, saveSettings] = useActionState(
    saveThoughtSettingsAction,
    emptyThoughtActionState("")
  );
  const [publishState, publishAction, publishPending] = useActionState(
    async (_state: ReturnType<typeof emptyThoughtActionState>, formData: FormData) =>
      publishThoughtFromListAction(String(formData.get("id") ?? "")),
    emptyThoughtActionState("")
  );
  const [deleting, startDeleting] = useTransition();
  const deleteDialog = useRef<HTMLDialogElement>(null);

  const drafts = items.filter((item) => item.status !== "published");
  const visibleItems = filter === "published" ? publishedItems : drafts;

  function openSettings(item: ThoughtListItem) {
    setSelected(item);
    settings.open();
  }

  useEffect(() => {
    if (saveState.status === "success") {
      settings.close();
      router.refresh();
    }
  }, [router, saveState.status, settings]);

  useEffect(() => {
    if (publishState.status === "success") {
      settings.close();
      router.refresh();
    }
  }, [publishState.status, router, settings]);

  function openDelete(item: ThoughtListItem) {
    setDeleteTarget(item);
    deleteDialog.current?.showModal();
  }

  function closeDelete() {
    deleteDialog.current?.close();
    setDeleteTarget(null);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    startDeleting(async () => {
      try {
        await deleteThoughtAction(id);
        closeDelete();
        router.refresh();
      } catch (error) {
        setReorderError(error instanceof Error ? error.message : "No se pudo borrar el artículo.");
      }
    });
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
    <section className="ui-list">
      <div className="ui-list-toolbar">
        <ListFilter
          ariaLabel="Filtrar thoughts"
          value={filter}
          onChange={(value) => setFilter(value === "draft" ? "draft" : "published")}
          options={[
            { value: "published", label: "Publicadas", count: publishedItems.length },
            { value: "draft", label: "Borradores", count: drafts.length },
          ]}
        />
      </div>

      {reorderError ? <p className="text-sm text-danger">{reorderError}</p> : null}
      {reordering ? <p className="text-sm text-secondary">Guardando orden...</p> : null}

      <div className="ui-list-items">
        {visibleItems.map((item) => (
          <Card
            key={item.id}
            variant="secondary"
            onDragOver={filter === "published" ? (event) => event.preventDefault() : undefined}
            onDrop={filter === "published" ? () => moveBefore(item.id) : undefined}
          >
            <Card.Header className="ui-list-card-header">
              {filter === "published" ? (
                <button
                  type="button"
                  draggable
                  className="ui-control ui-control--icon"
                  aria-label={`Reordenar ${item.title}`}
                  onDragStart={() => setDraggedId(item.id)}
                  onDragEnd={() => setDraggedId(null)}
                >
                  <Bars3Icon className="size-5" />
                </button>
              ) : null}
              <Link href={filter === "draft" ? item.editHref : item.href} className="ui-list-card-link">
                <Card.Title className="truncate">
                  {filter === "draft" ? item.draftTitle ?? item.title : item.title}
                </Card.Title>
                <Card.Description className="ui-list-card-description">
                  {filter === "draft" ? item.draftExcerpt ?? item.excerpt : item.excerpt}
                </Card.Description>
              </Link>
              <Button
                isIconOnly
                variant="ghost"
                size="sm"
                className="ui-control ui-control--icon ui-list-card-settings"
                aria-label={`Ajustes de ${item.title}`}
                onPress={() => openSettings(item)}
              >
                <EllipsisHorizontalIcon className="size-5" />
              </Button>
            </Card.Header>
            <Card.Footer className="ui-list-card-footer">
              <span className="truncate">{item.meta}</span>
              <div className="ui-list-card-actions">
                {filter === "published" ? (
                  <>
                    <Link href={item.href} className="ui-control">Ver</Link>
                    <Link href={item.editHref} className="ui-control">
                      {item.status === "draft+published" ? "Seguir editando" : "Editar"}
                    </Link>
                  </>
                ) : (
                  <>
                    <form
                      action={publishAction}
                      onSubmit={(event) => {
                        if (!item.publishable) {
                          event.preventDefault();
                          openSettings(item);
                        }
                      }}
                    >
                      <input type="hidden" name="id" value={item.id} />
                      <Button type="submit" className="ui-control ui-control--primary" isDisabled={publishPending}>Publicar</Button>
                    </form>
                    <Link href={item.editHref} className="ui-control">Seguir editando</Link>
                  </>
                )}
                <Button type="button" className="ui-control ui-control--danger" onPress={() => openDelete(item)}>
                  Borrar
                </Button>
                <span className="sr-only">{statusLabel[item.status]}</span>
              </div>
            </Card.Footer>
          </Card>
        ))}
      </div>

      {visibleItems.length === 0 ? (
        <Card variant="transparent">
          <Card.Content className="ui-empty-card">
            No hay artículos {filter === "published" ? "publicados" : "en borrador"}.
          </Card.Content>
        </Card>
      ) : null}

      <EditorialSettingsDrawer
        state={settings}
        title="Thought settings"
        footer={
          <>
            <Drawer.CloseTrigger className="ui-control">Cancel</Drawer.CloseTrigger>
            <Button type="submit" form="thought-list-settings" className="ui-control">
              Save settings
            </Button>
            <Button type="submit" name="intent" value="publish" form="thought-list-settings" className="ui-control ui-control--primary">
              Save and publish
            </Button>
          </>
        }
      >
        <form id="thought-list-settings" action={saveSettings} className="ui-form">
          <input type="hidden" name="id" value={selected?.id ?? ""} />
          <label className="ui-form-field">
            Slug
            <input
              key={selected?.id}
              name="manualSlug"
              defaultValue={selected?.slug ?? ""}
              className="ui-input"
            />
            {saveState.fieldErrors.slug ?? publishState.fieldErrors.slug ? (
              <span className="text-danger">{saveState.fieldErrors.slug ?? publishState.fieldErrors.slug}</span>
            ) : null}
          </label>
          <label className="ui-form-field">
            Excerpt
            <textarea
              key={`${selected?.id}-excerpt`}
              name="manualExcerpt"
              rows={3}
              defaultValue={selected?.excerpt ?? ""}
              className="ui-input"
            />
            {saveState.fieldErrors.excerpt ?? publishState.fieldErrors.excerpt ? (
              <span className="text-danger">{saveState.fieldErrors.excerpt ?? publishState.fieldErrors.excerpt}</span>
            ) : null}
          </label>
          <label className="ui-form-field">
            Cover image URL
            <input
              key={`${selected?.id}-cover`}
              name="manualCoverImageUrl"
              type="text"
              defaultValue={selected?.coverImageUrl ?? ""}
              className="ui-input"
            />
            {saveState.fieldErrors.coverImageUrl ?? publishState.fieldErrors.coverImageUrl ? (
              <span className="text-danger">
                {saveState.fieldErrors.coverImageUrl ?? publishState.fieldErrors.coverImageUrl}
              </span>
            ) : null}
          </label>
          <label className="ui-form-field">
            Publication date
            <input
              key={`${selected?.id}-date`}
              name="publishedDate"
              type="date"
              defaultValue={selected?.publishedDate.slice(0, 10) ?? ""}
              className="ui-input"
            />
          </label>
          <label className="ui-checkbox-field">
            <input
              key={`${selected?.id}-featured`}
              name="featured"
              type="checkbox"
              defaultChecked={selected?.featured ?? false}
            />
            Featured on homepage
          </label>
          {saveState.status === "error" ? <p className="text-sm text-danger">{saveState.message}</p> : null}
          {publishState.status === "error" ? <p className="text-sm text-danger">{publishState.message}</p> : null}
        </form>
      </EditorialSettingsDrawer>

      <dialog ref={deleteDialog} className="ui-dialog">
        <div className="ui-dialog-content">
          <div className="ui-dialog-heading">
            <h2 className="text-lg font-medium">¿Borrar “{deleteTarget?.title || "Untitled thought"}”?</h2>
            <p className="text-sm text-secondary">Esta acción elimina el borrador y la versión publicada.</p>
          </div>
          <div className="ui-dialog-actions">
            <Button type="button" className="ui-control" onPress={closeDelete}>Cancelar</Button>
            <Button type="button" className="ui-control ui-control--danger" onPress={confirmDelete} isDisabled={deleting}>
              {deleting ? "Borrando..." : "Borrar"}
            </Button>
          </div>
        </div>
      </dialog>
    </section>
  );
}
