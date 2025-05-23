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
    <section className="flex flex-col gap-4 md:gap-8">
      <Link href={link}>
        <div className="group hover:cursor-pointer flex flex-row place-content-between items-center">
          <p className="text-xs leading-normal text-secondary uppercase group-hover:text-primary group-hover:font-medium">
            {section}
          </p>
          <ChevronRightIcon className="size-8 rounded-full p-1.5 transition-colors duration-300 group-hover:bg-gray" />
        </div>
      </Link>
      <div className="flex flex-col gap-6">
        {items.map((item) => (
          <Item key={item.title} section={section} item={item} />
        ))}
      </div>
    </section>
  );
}
