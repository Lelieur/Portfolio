import Link from "next/link";
import Item from "./Item";
import { ItemType } from "@/types/item";
import { ChevronRightIcon } from "@heroicons/react/16/solid";

type HomeSectionProps = {
  title: string;
  link: string;
  items: ItemType[];
};

export default function HomeSection({ title, link, items }: HomeSectionProps) {
  return (
    <section className="flex flex-col gap-4 md:gap-8">
      <div className="group hover:cursor-pointer flex flex-row place-content-between items-center">
        <p className="text-xs leading-normal uppercase text-secondary uppercase group-hover:text-primary group-hover:font-medium">
          {title}
        </p>
        <Link
          href={link}
          className="size-8 rounded-full p-1.5 transition-colors duration-300 group-hover:bg-gray"
        >
          <ChevronRightIcon />
        </Link>
      </div>
      <div className="flex flex-col gap-6">
        {items.map((item) => (
          <Item key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}
