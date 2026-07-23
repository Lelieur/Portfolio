import AboutItem from "./AboutItem";
import { ItemType } from "@/types/item";

type AboutSectionProps = {
  title: string;
  items: ItemType[];
};

export default function AboutSection({ title, items }: AboutSectionProps) {
  return (
    <section className="ui-about-section">
      <div className="ui-about-section-header">
        <p className="ui-about-section-title">
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
            <li key={item.title} className="ui-about-item--plain">
              <p className="ui-about-item-title-text">
                {item.title}
              </p>
            </li>
          )
        )}
      </ul>
    </section>
  );
}
