import { AboutDetails } from "@/types/project";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

interface ProjectSectionProps {
  about: AboutDetails;
}

export default function ProjectSectionBis({ about }: ProjectSectionProps) {
  return (
    <section className="ui-content-block">
      <h2 className="ui-content-block-title">
        {about.title}
      </h2>
      {about.type === "text" && typeof about.content === "string" ? (
        about.content.split(/\r?\n/).map((line, index) => (
          <p
            key={`${line}-${index}`}
            className="ui-copy"
          >
            {line}
          </p>
        ))
      ) : about.type === "list" && Array.isArray(about.content) ? (
        <ul className="ui-content-list-disc">
          {about.content.map(
            (paragraph, index) =>
              typeof paragraph === "string" && (
                <li
                  key={index}
                  className="ui-copy"
                >
                  {paragraph}
                </li>
              )
          )}
        </ul>
      ) : about.type === "tags-grouped" ? (
        <ul className="ui-content-list-disc">
          {Object.entries(about.content).map(([key, value]) => (
            <li key={key}>
              <strong>{capitalizeFirstLetter(key)}:</strong>{" "}
              {Array.isArray(value) ? (
                value.map((item, index) => (
                  <span
                    key={index}
                    className="ui-copy"
                  >
                    {item}
                    {index < value.length - 1 && ", "}
                  </span>
                ))
              ) : (
                <span className="ui-copy">
                  {typeof value === "string" && value}
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        about.type === "text-with-links" && (
          <p className="ui-copy">
            Developed by{" "}
            <a
              href={about.links && about.links[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="ui-inline-link"
            >
              {about.links && about.links[0].label}
            </a>{" "}
            and{" "}
            <a
              href={about.links && about.links[1].url}
              target="_blank"
              rel="noopener noreferrer"
              className="ui-inline-link"
            >
              {about.links && about.links[1].label}
            </a>
          </p>
        )
      )}
    </section>
  );
}
