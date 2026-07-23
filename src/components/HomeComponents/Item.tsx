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
      <p className="ui-text-primary ui-inline-link">
        {item.title}
      </p>
      {item.description && (
        <p className="ui-text-sm">
          {item.description}
        </p>
      )}

      <div className="ui-content-row-divider" />
      {item.year && (
        <span className="ui-text-xs md:text-end">
          {item.year}
        </span>
      )}
      {item.date && (
        <span className="ui-text-xs md:text-end">
          {new Date(item.date).toLocaleDateString("es-ES")}
        </span>
      )}
    </Link>
  );
}
