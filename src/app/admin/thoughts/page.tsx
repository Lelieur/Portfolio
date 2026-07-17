import { ThoughtsAdminList } from "@/components/AdminThoughts/ThoughtsAdminList";
import { getThoughtDocuments } from "@/server/thoughts/queries";
import { asThought, summarizeThoughtDocument } from "@/server/thoughts/domain";

export default async function AdminThoughtsPage() {
  const documents = await getThoughtDocuments();

  return (
    <main className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.2em] text-secondary">
          Admin
        </p>
        <h1 className="text-3xl font-medium text-primary">Thoughts</h1>
        <p className="max-w-3xl text-base text-secondary">
          Lista de artículos. La edición vive fuera de esta vista.
        </p>
      </header>

      <ThoughtsAdminList
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
            draftHref: `/admin/thoughts/${document.id}`,
            title: thought.title || documentSummary.title,
            excerpt: thought.excerpt || documentSummary.excerpt,
            draftTitle: draftThought?.title,
            draftExcerpt: draftThought?.excerpt,
            slug: settingsThought.slug || documentSummary.slug,
            publishedDate: settingsThought.publishedDate,
            featured: settingsThought.featured,
            meta: `${documentSummary.updatedAtLabel} · /thoughts/${publishedThought?.slug ?? thought.slug ?? documentSummary.slug}`,
            status: documentSummary.status,
            order: publishedThought?.order ?? 0,
            published: Boolean(publishedThought),
          }];
        })}
      />
    </main>
  );
}
