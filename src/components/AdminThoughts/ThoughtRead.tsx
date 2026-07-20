"use client";

import Image from "next/image";
import { useOverlayState } from "@heroui/react";
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
}: {
  documentId: string;
  thought: Thought;
  status: "draft" | "published" | "draft+published";
}) {
  const settings = useOverlayState();

  return (
    <EditorialReadShell
      title={thought.title}
      description="Owner-only read surface for reviewing the current draft or live version."
      status={status}
      statusLabel={statusLabel[status]}
      backHref="/admin/thoughts"
      editHref={`/admin/thoughts/${documentId}/edit`}
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
  );
}
