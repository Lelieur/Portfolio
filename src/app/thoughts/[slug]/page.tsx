import { notFound } from "next/navigation";
import { getPublishedThought } from "@/server/thoughts/queries";
import PageTitle from "@/components/PageTitle";
import ThoughtDetailsList from "@/components/ThougthsComponents/ThoughtDetailsList";
import Image from "next/image";

export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ slug: string }>;
}

export default async function ThoughtPage({ params }: Params) {
  const { slug } = await params;
  const thought = await getPublishedThought(slug);

  if (!thought) return notFound();

  const { title, body, publishedDate, coverImageUrl } = thought;

  return (
    <main className="flex flex-col gap-16 text-justify">
      <article className="flex flex-col gap-16">
        <PageTitle
          title={title}
          description={thought.excerpt}
        />
        <ThoughtDetailsList details={{ date: publishedDate }} />
        <figure className="mt-8 flex flex-col gap-4">
          <Image
            src={coverImageUrl}
            alt={title}
            width="1280"
            height="1600"
            priority
            className="size-full rounded-md border border-primary/15"
          />
          <figcaption className="pb-2 text-xs leading-normal text-secondary">{`Figure 1: ${title}`}</figcaption>
        </figure>
        {
          <p className="prose prose-neutral max-w-none whitespace-pre-wrap">{body}</p>
        }
      </article>
    </main>
  );
}
