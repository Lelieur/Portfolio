import { notFound } from "next/navigation";
import { MediumPost } from "@/types/thoughts";
import { fetchMediumPost } from "@/lib/fetchOneMediumPost";
import PageTitle from "@/components/PageTitle";
import ThoughtDetailsList from "@/components/ThougthsComponents/ThoughtDetailsList";
import Image from "next/image";

interface Params {
  params: { slug: string };
}

export default async function ThoughtPage({ params }: Params) {
  const { slug } = await params;
  const thought: MediumPost | null = await fetchMediumPost(slug);

  if (!thought) return notFound();

  const { title, content, date, link, image } = thought;

  return (
    <main className="flex flex-col gap-16 text-justify">
      <article className="flex flex-col gap-16">
        <PageTitle
          title={title}
          description={content.match(/<p>(.*?)<\/p>/)?.[1] || ""}
        />
        <ThoughtDetailsList details={{ date, link }} />
        <figure className="mt-8 flex flex-col gap-4">
          <Image
            src={image}
            alt={title}
            width="1280"
            height="1600"
            priority
            className="size-full rounded-md border border-primary/15"
          />
          <figcaption className="pb-2 text-xs leading-normal text-secondary">{`Figure 1: ${title}`}</figcaption>
        </figure>
        {/* <article
          className="prose prose-neutral max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        /> */}
        <article className="prose lg:prose-xl">
          <h1>Garlic bread with cheese: What the science tells us</h1>
          <p>
            For years parents have espoused the health benefits of eating garlic
            bread with cheese to their children, with the food earning such an
            iconic status in our culture that kids will often dress up as warm,
            cheesy loaf for Halloween.
          </p>
          <p>
            But a recent study shows that the celebrated appetizer may be linked
            to a series of rabies cases springing up around the country.
          </p>
        </article>
      </article>
    </main>
  );
}
