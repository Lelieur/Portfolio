import { EditorialPageShell } from "@/components/Admin/EditorialShell";
import { ThoughtEditor } from "@/components/AdminThoughts/ThoughtEditor";
import { EMPTY_THOUGHT } from "@/server/thoughts/types";

export default function NewThoughtPage() {
  return (
    <EditorialPageShell
      title="New thought"
      description="Shared edit shell for creating a draft."
    >
      <ThoughtEditor
        documentId=""
        initialThought={EMPTY_THOUGHT}
        hasSavedDocument={false}
        status="draft"
      />
    </EditorialPageShell>
  );
}
