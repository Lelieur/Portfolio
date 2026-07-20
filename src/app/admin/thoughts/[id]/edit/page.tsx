import { EditorialPageShell } from "@/components/Admin/EditorialShell";
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
    <EditorialPageShell
      title="Edit thought"
      description="Shared edit shell for draft and publish flows."
    >
      <ThoughtEditor
        documentId={id}
        initialThought={thought}
        hasSavedDocument
        status={summarizeThoughtDocument(document).status}
      />
    </EditorialPageShell>
  );
}
