import Link from "next/link";
import Image from "next/image";
import { MediumPost } from "@/types/thougths";

export default function ThougthCard({
  title,
  content,
  slug,
  date,
  image,
}: MediumPost) {
  return (
    <Link href={`thoughts/${slug}`}>
      <div className="relative grid grid-cols-6 items-center gap-3 md:gap-6">
        <div className="col-span-6 flex flex-row place-content-between md:col-span-2">
          <Image
            width="1200"
            height="600"
            src={image}
            alt={title}
            priority
            className="h-auto w-full rounded-md border border-primary/15 object-cover"
          />
        </div>
        <div className="col-span-6 flex flex-col gap-0.5 md:gap-2 md:col-span-4">
          <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-4">
            <p className="text-base leading-normal relative flex flex-col gap-0.5 font-medium text-primary underline decoration-secondary decoration-dotted underline-offset-8">
              {title}
            </p>
            <div className="hidden flex-auto border-[0.5px] border-secondary/15 md:block"></div>
            <p className="text-sm leading-normal relative text-primary">
              {new Date(date).toLocaleDateString()}
            </p>
          </div>
          <div className="text-sm leading-normal line-clamp-1 text-secondary">
            <p className="text-sm leading-normal line-clamp-1 text-secondary">
              {content.match(/<h3>(.*?)<\/h3>/)?.[1] || ""}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
