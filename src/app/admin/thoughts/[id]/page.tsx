import { notFound } from "next/navigation";
import { EditorialPageShell } from "@/components/Admin/EditorialShell";
import { ThoughtRead } from "@/components/AdminThoughts/ThoughtRead";
import { asThought } from "@/server/thoughts/domain";
import { getThoughtDocuments } from "@/server/thoughts/queries";
import { summarizeThoughtDocument } from "@/server/thoughts/domain";

export default async function AdminThoughtPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const document = (await getThoughtDocuments()).find((item) => item.id === id);
  const thought = document && (asThought(document.draft) ?? asThought(document.published));

  if (!document || !thought) notFound();

  return (
    <EditorialPageShell
      title="Thought"
      description="Owner-only read mode using the shared editorial shell."
    >
      <ThoughtRead
        documentId={id}
        thought={thought}
        status={summarizeThoughtDocument(document).status}
      />
    </EditorialPageShell>
  );
}
