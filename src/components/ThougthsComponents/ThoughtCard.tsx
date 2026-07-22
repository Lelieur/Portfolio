import Link from "next/link";
import Image from "next/image";
import type { Thought } from "@/server/thoughts/types";

export default function ThoughtCard({
  title,
  slug,
  excerpt,
  coverImageUrl,
  publishedDate,
}: Thought) {
  return (
    <Link href={`/thoughts/${slug}`}>
      <div className="ui-content-card">
        <div className="ui-content-card-media">
          <Image
            width="1200"
            height="600"
            src={coverImageUrl}
            alt={title}
            priority
            className="ui-content-card-image"
          />
        </div>
        <div className="ui-content-card-body">
          <div className="ui-content-card-header">
            <p className="text-base leading-normal relative flex flex-col gap-0.5 font-medium text-primary underline decoration-secondary decoration-dotted underline-offset-8">
              {title}
            </p>
            <div className="ui-content-card-divider" />
            <p className="text-sm leading-normal relative text-primary">
              {new Date(publishedDate).toLocaleDateString()}
            </p>
          </div>
          <p className="ui-content-card-summary">{excerpt}</p>
        </div>
      </div>
    </Link>
  );
}
