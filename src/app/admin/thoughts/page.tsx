import { EditorialPageShell } from "@/components/Admin/EditorialShell";
import { ThoughtsAdminList } from "@/components/AdminThoughts/ThoughtsAdminList";
import { getThoughtDocuments } from "@/server/thoughts/queries";
import { asThought, prepareThoughtForPublish, summarizeThoughtDocument } from "@/server/thoughts/domain";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";

export default async function AdminThoughtsPage() {
  const documents = await getThoughtDocuments();

  return (
    <EditorialPageShell
      title="Thoughts"
      description="Owner list view for published and draft Thoughts."
      actions={
        <Link
          href="/admin/thoughts/new"
          className="editorial-control bg-primary text-background"
        >
          <span className="inline-flex items-center gap-2">
            <PlusIcon className="size-4" />
            New article
          </span>
        </Link>
      }
    >
      <ThoughtsAdminList
        key={documents.map((document) => `${document.id}:${document.updatedAt.getTime()}`).join("|")}
        items={documents.flatMap((document) => {
          const documentSummary = summarizeThoughtDocument(document);
          const draftThought = asThought(document.draft);
          const publishedThought = asThought(document.published);
          const thought = publishedThought ?? draftThought;
          if (!thought) return [];
          const settingsThought = draftThought ?? thought;

          const href = `/admin/thoughts/${document.id}`;

          return [{
            id: document.id,
            href,
            editHref: `/admin/thoughts/${document.id}/edit`,
            publishable: Boolean(
              prepareThoughtForPublish(settingsThought, publishedThought).ok
            ),
            title: thought.title || documentSummary.title,
            excerpt: thought.excerpt || documentSummary.excerpt,
            draftTitle: draftThought?.title,
            draftExcerpt: draftThought?.excerpt,
            slug: settingsThought.slug || documentSummary.slug,
            coverImageUrl: settingsThought.coverImageUrl,
            publishedDate: settingsThought.publishedDate,
            featured: settingsThought.featured,
            meta: `${documentSummary.updatedAtLabel} · /thoughts/${publishedThought?.slug ?? thought.slug ?? documentSummary.slug}`,
            status: documentSummary.status,
            order: publishedThought?.order ?? 0,
            published: Boolean(publishedThought),
          }];
        })}
      />
    </EditorialPageShell>
  );
}
