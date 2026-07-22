import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { getPublishedThoughtDocument } from "@/server/thoughts/queries";
import PageTitle from "@/components/PageTitle";
import ThoughtDetailsList from "@/components/ThougthsComponents/ThoughtDetailsList";
import Image from "next/image";

export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ slug: string }>;
}

export default async function ThoughtPage({ params }: Params) {
  const { slug } = await params;
  const session = await auth();
  const publishedDocument = await getPublishedThoughtDocument(slug);
  const thought = publishedDocument?.thought ?? null;

  if (!thought) return notFound();

  const { title, body, publishedDate, coverImageUrl } = thought;

  return (
    <main className="ui-detail-page ui-detail-page--thought">
      <article className="ui-detail-article">
        <PageTitle
          title={title}
          description={thought.excerpt}
        />
        {session?.user && publishedDocument && (
          <div className="ui-detail-actions">
            <Link
              href={`/admin/thoughts/${publishedDocument.id}`}
              className="ui-control"
            >
              Editar
            </Link>
          </div>
        )}
        <ThoughtDetailsList details={{ date: publishedDate }} />
        {coverImageUrl ? (
          <figure className="ui-detail-figure">
            <Image
              src={coverImageUrl}
              alt={title}
              width="1280"
              height="1600"
              priority
              className="ui-detail-image"
            />
            <figcaption className="ui-detail-caption">{`Figure 1: ${title}`}</figcaption>
          </figure>
        ) : null}
        <div
          className="ui-detail-rich-text prose prose-neutral max-w-none"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </article>
    </main>
  );
}
