import Link from "next/link";
import Item from "./Item";
import { ItemType } from "@/types/item";
import { ChevronRightIcon } from "@heroicons/react/16/solid";

type HomeSectionProps = {
  section: string;
  link: string;
  items: ItemType[];
};

export default function HomeSection({
  section,
  link,
  items,
}: HomeSectionProps) {
  return (
    <section className="ui-home-section">
      <Link href={link}>
        <div className="ui-home-section-header group">
          <p className="text-xs leading-normal text-secondary uppercase group-hover:text-primary group-hover:font-medium">
            {section}
          </p>
          <ChevronRightIcon className="size-8 rounded-full p-1.5 transition-colors duration-300 group-hover:bg-hover-background" />
        </div>
      </Link>
      <div className="ui-home-items">
        {items.map((item) => (
          <Item key={item.title} section={section} item={item} />
        ))}
      </div>
    </section>
  );
}
