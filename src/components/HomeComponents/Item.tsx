import Link from "next/link";
import { ItemType } from "@/types/item";
import { toSlug } from "@/lib/toSlug";

type ItemProps = {
  section: string;
  item: ItemType;
};

export default function Item({ section, item }: ItemProps) {
  return (
    <Link
      href={`/${section.toLowerCase()}/${toSlug(item.title)}`}
      className="flex flex-col items-start md:flex-row md:items-center gap-1 md:gap-4 duration-300 hover:translate-x-0.5"
    >
      <p className="text-base leading-normal text-primary underline decoration-dotted decoration-secondary underline-offset-8">
        {item.title}
      </p>
      {item.description && (
        <p className="text-sm leading-normal text-secondary">
          {item.description}
        </p>
      )}

      <div className="flex-auto border-[0.5px] border-secondary/15"></div>
      {item.year && (
        <span className=" md:text-end text-xs leading-normal text-secondary">
          {item.year}
        </span>
      )}
      {item.date && (
        <span className="md:text-end text-xs leading-normal text-secondary">
          {new Date(item.date).toLocaleDateString("es-ES")}
        </span>
      )}
    </Link>
  );
}
