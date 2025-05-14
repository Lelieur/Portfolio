import { ItemType } from "@/types/item";
import { ArrowUpRightIcon } from "@heroicons/react/16/solid";

export default function AboutItem({
  title,
  description,
  year,
  link,
}: ItemType) {
  return (
    <div className="col-span-3 flex flex-col gap-4">
      <div className="flex flex-col items-start gap-1.5">
        <div className="flex items-center gap-2 md:gap-4">
          {link ? (
            <a
              href={link}
              className="inline underline decoration-secondary decoration-dotted underline-offset-4 text-primary"
            >
              <span className="group inline text-base">
                <span className="inline">{title}</span>
                <span className="ml-1 inline-flex aspect-square size-4 align-text-bottom duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  <ArrowUpRightIcon />
                </span>
              </span>
            </a>
          ) : (
            <span className="inline text-base">{title}</span>
          )}
        </div>
        <p className="text-sm leading-normal block text-secondary">{year}</p>
      </div>
      <ul className="list-inside list-disc space-y-0.5 text-primary">
        {Array.isArray(description) ? (
          description.map((desc, index) => (
            <li key={index}>
              <p className="text-sm inline leading-relaxed text-primary">
                {desc}
              </p>
            </li>
          ))
        ) : (
          <p className="text-sm inline leading-relaxed text-primary">
            {description}
          </p>
        )}
      </ul>
    </div>
  );
}
