import { notFound } from "next/navigation";
import { ThoughtEditor } from "@/components/AdminThoughts/ThoughtEditor";
import { asThought, summarizeThoughtDocument } from "@/server/thoughts/domain";
import { getThoughtDocuments } from "@/server/thoughts/queries";

export default async function EditThoughtPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const document = (await getThoughtDocuments()).find((item) => item.id === id);
  const thought = document && (asThought(document.draft) ?? asThought(document.published));

  if (!document || !thought) notFound();

  return (
    <main className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.2em] text-secondary">Admin</p>
        <h1 className="text-3xl font-medium text-primary">Editar thought</h1>
      </header>
      <ThoughtEditor
        documentId={id}
        initialThought={thought}
        hasSavedDocument
        status={summarizeThoughtDocument(document).status}
      />
    </main>
  );
}
