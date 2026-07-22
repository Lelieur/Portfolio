import AboutItem from "./AboutItem";
import { ItemType } from "@/types/item";

type AboutSectionProps = {
  title: string;
  items: ItemType[];
};

export default function AboutSection({ title, items }: AboutSectionProps) {
  return (
    <section className="ui-about-section">
      <div className="flex flex-row place-content-between items-center">
        <p className="text-xs leading-normal uppercase text-secondary uppercase group-hover:text-primary group-hover:font-medium">
          {title}
        </p>
      </div>
      <ul className="ui-about-list">
        {items.map((item) =>
          item.year ? (
            <li
              key={item.title}
              className={`ui-about-item ${title === "Experience" ? "ui-about-item--experience" : ""}`}
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
