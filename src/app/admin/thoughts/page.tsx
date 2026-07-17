import { AdminContentList } from "@/components/AdminContent/AdminContentList";
import { AdminEditorShell } from "@/components/AdminContent/AdminEditorShell";
import { ThoughtEditor } from "@/components/AdminThoughts/ThoughtEditor";
import { getThoughtDocuments } from "@/server/thoughts/queries";
import { summarizeThoughtDocument } from "@/server/thoughts/domain";
import { EMPTY_THOUGHT, type Thought } from "@/server/thoughts/types";

function value(document: { draft: unknown; published: unknown }): Thought {
  return (document.draft ?? document.published ?? EMPTY_THOUGHT) as Thought;
}

export default async function AdminThoughtsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const documents = await getThoughtDocuments();
  const { id } = await searchParams;
  const selectedId = id && documents.some((document) => document.id === id)
    ? id
    : documents[0]?.id ?? "new";
  const selectedDocument = selectedId === "new"
    ? { id: "", draft: EMPTY_THOUGHT, published: null }
    : documents.find((document) => document.id === selectedId) ?? {
        id: "",
        draft: EMPTY_THOUGHT,
        published: null,
      };
  const summary = summarizeThoughtDocument(selectedDocument);

  return (
    <AdminEditorShell
      eyebrow="Admin"
      title="Thoughts"
      description="Preview-first editing for authored long-form content. Draft changes stay private until you publish."
      sidebar={
        <AdminContentList
          title="Documents"
          description="Review document status, pick an existing thought, or start a new draft."
          createHref="/admin/thoughts?id=new"
          items={documents.map((document) => {
            const documentSummary = summarizeThoughtDocument(document);
            return {
              id: document.id,
              href: `/admin/thoughts?id=${document.id}`,
              title: documentSummary.title,
              description: documentSummary.excerpt,
              meta: `${documentSummary.updatedAtLabel} · /thoughts/${documentSummary.slug}`,
              status: documentSummary.status,
              selected: document.id === selectedId,
            };
          })}
        />
      }
      editor={
        <ThoughtEditor
          key={selectedDocument.id || "new"}
          documentId={selectedDocument.id}
          initialThought={value(selectedDocument)}
          hasSavedDocument={Boolean(selectedDocument.id)}
          status={summary.status}
        />
      }
    />
  );
}
