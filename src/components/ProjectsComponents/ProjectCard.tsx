import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types/project';

export default function ProjectCard({ image, title, year, description, link }: Project) {
  return (
    <Link href={link}>
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
            <p className="text-sm leading-normal relative text-primary">{year}</p>
          </div>
          <div className="text-sm leading-normal line-clamp-1 text-secondary">
            <p className="text-sm leading-normal line-clamp-1 text-secondary">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
