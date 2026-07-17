import { ThoughtEditor } from "@/components/AdminThoughts/ThoughtEditor";
import { EMPTY_THOUGHT } from "@/server/thoughts/types";

export default function NewThoughtPage() {
  return (
    <main className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.2em] text-secondary">Admin</p>
        <h1 className="text-3xl font-medium text-primary">Nuevo thought</h1>
      </header>
      <ThoughtEditor
        documentId=""
        initialThought={EMPTY_THOUGHT}
        hasSavedDocument={false}
        status="draft"
      />
    </main>
  );
}
