import { ItemType } from "@/types/item";
import { ArrowUpRightIcon } from "@heroicons/react/16/solid";

export default function AboutItem({
  title,
  description,
  year,
  link,
}: ItemType) {
  return (
    <div className="ui-about-item-content">
      <div className="ui-about-item-header">
        <div className="ui-about-item-title">
          {link ? (
            <a
              href={link}
              className="ui-inline-link ui-about-item-link"
            >
              <span className="ui-about-item-link-content">
                <span>{title}</span>
                <span className="ui-external-link-icon">
                  <ArrowUpRightIcon />
                </span>
              </span>
            </a>
          ) : (
            <span className="ui-about-item-title-text">{title}</span>
          )}
        </div>
        <p className="ui-about-item-year">{year}</p>
      </div>
      <ul className="ui-about-item-details ui-about-item-details--bulleted">
        {Array.isArray(description) ? (
          description.map((desc, index) => (
            <li key={index}>
              <p className="ui-about-item-description">
                {desc}
              </p>
            </li>
          ))
        ) : (
          <p className="ui-about-item-description">
            {description}
          </p>
        )}
      </ul>
    </div>
  );
}
