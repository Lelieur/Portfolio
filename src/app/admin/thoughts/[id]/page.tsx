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
  const publishedThought = asThought(document?.published);
  const draftThought = asThought(document?.draft);
  const thought = publishedThought ?? draftThought;

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
        hasUnpublishedChanges={Boolean(
          publishedThought &&
            draftThought &&
            JSON.stringify(publishedThought) !== JSON.stringify(draftThought)
        )}
      />
    </EditorialPageShell>
  );
}
