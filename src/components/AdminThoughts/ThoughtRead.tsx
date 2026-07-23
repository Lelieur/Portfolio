"use client";

import Image from "next/image";
import Link from "next/link";
import { Button, useOverlayState } from "@/components/ui";
import { useEffect, useRef } from "react";
import { EditorialReadShell } from "@/components/Admin/EditorialShell";
import ThoughtDetailsList from "@/components/ThougthsComponents/ThoughtDetailsList";
import type { Thought } from "@/server/thoughts/types";

const statusLabel = {
  draft: "Draft",
  published: "Published",
  "draft+published": "Published with draft",
} as const;

export function ThoughtRead({
  documentId,
  thought,
  status,
  hasUnpublishedChanges,
}: {
  documentId: string;
  thought: Thought;
  status: "draft" | "published" | "draft+published";
  hasUnpublishedChanges: boolean;
}) {
  const settings = useOverlayState();
  const changesDialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (hasUnpublishedChanges) changesDialog.current?.showModal();
  }, [hasUnpublishedChanges]);

  return (
    <>
    <EditorialReadShell
      title={thought.title}
      description="Owner-only read surface for reviewing the current draft or live version."
      status={status}
      statusLabel={statusLabel[status]}
      backHref="/admin/thoughts"
      editHref={`/admin/thoughts/${documentId}/edit`}
      publicHref={status === "draft" ? undefined : `/thoughts/${thought.slug}`}
      publicLabel="Ver público"
      settings={settings}
      settingsTitle="Thought settings"
      settingsContent={
        <>
          <div className="ui-meta-group">
            <span className="ui-meta-label">Slug</span>
            <span className="ui-meta-value">/thoughts/{thought.slug}</span>
          </div>
          <div className="ui-meta-group">
            <span className="ui-meta-label">Publication date</span>
            <span className="ui-meta-value">{thought.publishedDate || "Missing"}</span>
          </div>
          <div className="ui-meta-group">
            <span className="ui-meta-label">Featured</span>
            <span className="ui-meta-value">{thought.featured ? "Yes" : "No"}</span>
          </div>
          <div className="ui-meta-group">
            <span className="ui-meta-label">Excerpt</span>
            <span className="ui-meta-value">{thought.excerpt || "Missing"}</span>
          </div>
          <div className="ui-meta-group">
            <span className="ui-meta-label">Last public update</span>
            <span className="ui-meta-value">{thought.lastPublicUpdate || "Not published yet"}</span>
          </div>
        </>
      }
      canvas={
        <article className="flex flex-col gap-10 text-justify">
          <ThoughtDetailsList details={{ date: thought.publishedDate }} />
          {thought.coverImageUrl ? (
            <figure className="flex flex-col gap-4">
              <Image
                src={thought.coverImageUrl}
                alt={thought.title}
                width={1280}
                height={1600}
                className="ui-admin-cover"
              />
            </figure>
          ) : null}
          <div
            className="prose prose-neutral max-w-none"
            dangerouslySetInnerHTML={{ __html: thought.body }}
          />
        </article>
      }
    />
      <dialog ref={changesDialog} className="ui-dialog">
        <div className="ui-dialog-content">
          <div className="grid gap-2">
            <h2 className="ui-dialog-title">Hay cambios sin publicar</h2>
            <p className="ui-dialog-description">La versión publicada se muestra aquí. Puedes continuar editando el borrador.</p>
          </div>
          <div className="ui-dialog-actions">
            <Button type="button" className="ui-control" onPress={() => changesDialog.current?.close()}>Cerrar</Button>
            <Link href={`/admin/thoughts/${documentId}/edit`} className="ui-control ui-control--primary">Seguir editando</Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
