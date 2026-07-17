import { saveThought, unpublishThought } from "@/server/thoughts/actions";
import { getThoughtDocuments } from "@/server/thoughts/queries";
import { EMPTY_THOUGHT, type Thought } from "@/server/thoughts/types";

function value(document: { draft: unknown; published: unknown }): Thought {
  return (document.draft ?? document.published ?? EMPTY_THOUGHT) as Thought;
}

export default async function AdminThoughtsPage() {
  const documents = await getThoughtDocuments();

  return (
    <main className="flex flex-col gap-8">
      <h1 className="text-3xl font-medium text-primary">Thoughts</h1>
      {[{ id: "", draft: EMPTY_THOUGHT, published: null }, ...documents].map(
        (document) => {
          const thought = value(document);
          return (
            <form key={document.id || "new"} action={saveThought} className="grid gap-3 rounded-md border border-primary/15 p-4">
              <input type="hidden" name="id" value={document.id} />
              <label>Title<input name="title" defaultValue={thought.title} required /></label>
              <label>Slug<input name="slug" defaultValue={thought.slug} required /></label>
              <label>Excerpt<input name="excerpt" defaultValue={thought.excerpt} required /></label>
              <label>Cover image URL<input name="coverImageUrl" defaultValue={thought.coverImageUrl} required /></label>
              <label>Published date<input name="publishedDate" type="date" defaultValue={thought.publishedDate.slice(0, 10)} required /></label>
              <label>Markdown body<textarea name="body" defaultValue={thought.body} rows={10} required /></label>
              <label>Collection order<input name="order" type="number" min="0" defaultValue={thought.order} /></label>
              <label>Featured order<input name="featuredOrder" type="number" min="0" defaultValue={thought.featuredOrder} /></label>
              <label><input name="featured" type="checkbox" defaultChecked={thought.featured} /> Featured</label>
              <div className="flex gap-3">
                <button name="intent" value="draft" type="submit">Save draft</button>
                <button name="intent" value="publish" type="submit">Publish</button>
                {document.id && <button formAction={unpublishThought} type="submit">Unpublish</button>}
              </div>
            </form>
          );
        }
      )}
    </main>
  );
}
