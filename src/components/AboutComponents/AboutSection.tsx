import AboutItem from "./AboutItem";
import { ItemType } from "@/types/item";

type AboutSectionProps = {
  title: string;
  items: ItemType[];
};

export default function AboutSection({ title, items }: AboutSectionProps) {
  return (
    <section className="flex flex-col gap-4 md:gap-8">
      <div className="flex flex-row place-content-between items-center">
        <p className="text-xs leading-normal uppercase text-secondary uppercase group-hover:text-primary group-hover:font-medium">
          {title}
        </p>
      </div>
      <ul className="flex flex-col">
        {items.map((item) =>
          item.year ? (
            <li
              key={item.title}
              className={`grid grid-cols-1 items-start gap-4 ${
                title === "Experience" ? "py-6" : "py-0"
              } first:pt-0 last:pb-0 sm:grid-cols-3 md:gap-8 md:py-8`}
            >
              <AboutItem {...item} />
            </li>
          ) : (
            <li key={item.title} className="first:mt-0 mt-2">
              <p className="text-base leading-normal text-primary">
                {item.title}
              </p>
            </li>
          )
        )}
      </ul>
    </section>
  );
}
