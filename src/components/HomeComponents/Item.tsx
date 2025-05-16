import Link from 'next/link';
import { ItemType } from '@/types/item';

export default function Item({ title, description, year, slug }: ItemType) {
  return (
    <Link
      href={`/projects/${slug}`}
      className="grid grid-cols-10 duration-300  hover:translate-x-0.5"
    >
      <div className="col-span-9 flex flex-col items-start md:flex-row md:items-center gap-2 md:gap-4">
        <p className="text-base leading-normal text-primary underline decoration-dotted decoration-secondary underline-offset-8">
          {title}
        </p>
        {description && <p className="text-sm leading-normal text-secondary">{description}</p>}
        <div className="flex-auto border-[0.5px] border-secondary/15"></div>
      </div>
      <p className="col-span-9 md:col-span-1 md:text-end text-xs leading-normal text-secondary">
        {year}
      </p>
    </Link>
  );
}
