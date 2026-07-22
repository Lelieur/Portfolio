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
      className="ui-content-row"
    >
      <p className="text-base leading-normal text-primary underline decoration-dotted decoration-secondary underline-offset-8">
        {item.title}
      </p>
      {item.description && (
        <p className="text-sm leading-normal text-secondary">
          {item.description}
        </p>
      )}

      <div className="ui-content-row-divider" />
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
