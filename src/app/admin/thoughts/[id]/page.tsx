import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageTitle from "@/components/PageTitle";
import ThoughtDetailsList from "@/components/ThougthsComponents/ThoughtDetailsList";
import { asThought } from "@/server/thoughts/domain";
import { getThoughtDocuments } from "@/server/thoughts/queries";

export default async function AdminThoughtPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const document = (await getThoughtDocuments()).find((item) => item.id === id);
  const thought = document && (asThought(document.draft) ?? asThought(document.published));

  if (!thought) notFound();

  return (
    <main className="flex flex-col gap-16 text-justify">
      <article className="flex flex-col gap-16">
        <PageTitle title={thought.title} description={thought.excerpt} />
        <div>
          <Link
            href={`/admin/thoughts/${id}/edit`}
            className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-background transition hover:opacity-85"
          >
            Editar
          </Link>
        </div>
        <ThoughtDetailsList details={{ date: thought.publishedDate }} />
        <figure className="mt-8 flex flex-col gap-4">
          <Image
            src={thought.coverImageUrl}
            alt={thought.title}
            width={1280}
            height={1600}
            className="size-full rounded-md border border-primary/15"
          />
          <figcaption className="pb-2 text-xs leading-normal text-secondary">
            {`Figure 1: ${thought.title}`}
          </figcaption>
        </figure>
        <p className="prose prose-neutral max-w-none whitespace-pre-wrap">{thought.body}</p>
      </article>
    </main>
  );
}
