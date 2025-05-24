import { AboutDetails } from "@/types/project";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

interface ProjectSectionProps {
  about: AboutDetails;
}

export default function ProjectSectionBis({ about }: ProjectSectionProps) {
  return (
    <section className="flex flex-col first:pt-0 last:pb-0 gap-8 py-8">
      <h2 className="text-base leading-normal font-medium text-primary">
        {about.title}
      </h2>
      {about.type === "text" && typeof about.content === "string" ? (
        about.content.split(/\r?\n/).map((line, index) => (
          <p
            key={`${line}-${index}`}
            className="text-base leading-normal text-secondary"
          >
            {line}
          </p>
        ))
      ) : about.type === "list" && Array.isArray(about.content) ? (
        <ul className="list-disc pl-5">
          {about.content.map(
            (paragraph, index) =>
              typeof paragraph === "string" && (
                <li
                  key={index}
                  className="text-base leading-normal text-secondary"
                >
                  {paragraph}
                </li>
              )
          )}
        </ul>
      ) : about.type === "tags-grouped" ? (
        <ul className="list-disc pl-5">
          {Object.entries(about.content).map(([key, value]) => (
            <li key={key}>
              <strong>{capitalizeFirstLetter(key)}:</strong>{" "}
              {Array.isArray(value) ? (
                value.map((item, index) => (
                  <span
                    key={index}
                    className="text-base leading-normal text-secondary"
                  >
                    {item}
                    {index < value.length - 1 && ", "}
                  </span>
                ))
              ) : (
                <span className="text-base leading-normal text-secondary">
                  {typeof value === "string" && value}
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        about.type === "text-with-links" && (
          <p className="text-base leading-normal text-secondary">
            Developed by{" "}
            <a
              href={about.links && about.links[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-secondary decoration-dotted underline-offset-4 text-primary"
            >
              {about.links && about.links[0].label}
            </a>{" "}
            and{" "}
            <a
              href={about.links && about.links[1].url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-secondary decoration-dotted underline-offset-4 text-primary "
            >
              {about.links && about.links[1].label}
            </a>
          </p>
        )
      )}
    </section>
  );
}
