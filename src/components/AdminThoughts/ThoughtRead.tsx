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
          <div className="grid gap-1 text-sm text-secondary">
            <span className="uppercase tracking-[0.2em]">Slug</span>
            <span className="text-primary">/thoughts/{thought.slug}</span>
          </div>
          <div className="grid gap-1 text-sm text-secondary">
            <span className="uppercase tracking-[0.2em]">Publication date</span>
            <span className="text-primary">{thought.publishedDate || "Missing"}</span>
          </div>
          <div className="grid gap-1 text-sm text-secondary">
            <span className="uppercase tracking-[0.2em]">Featured</span>
            <span className="text-primary">{thought.featured ? "Yes" : "No"}</span>
          </div>
          <div className="grid gap-1 text-sm text-secondary">
            <span className="uppercase tracking-[0.2em]">Excerpt</span>
            <span className="text-primary">{thought.excerpt || "Missing"}</span>
          </div>
          <div className="grid gap-1 text-sm text-secondary">
            <span className="uppercase tracking-[0.2em]">Last public update</span>
            <span className="text-primary">{thought.lastPublicUpdate || "Not published yet"}</span>
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
                className="size-full rounded-md border border-primary/15"
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
            <h2 className="text-lg font-medium">Hay cambios sin publicar</h2>
            <p className="text-sm text-secondary">La versión publicada se muestra aquí. Puedes continuar editando el borrador.</p>
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
