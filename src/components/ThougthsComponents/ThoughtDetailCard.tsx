import { ArrowUpRightIcon } from "@heroicons/react/16/solid";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { formatDate } from "@/lib/formatDate";

interface ThoughtDetailsCardProp {
  detail: Record<string, string>;
}

export default function ThoughtDetailCard({ detail }: ThoughtDetailsCardProp) {
  const detailTitle = capitalizeFirstLetter(Object.keys(detail)[0]);
  const detailValue = Object.values(detail)[0];

  return (
    <div className="flex flex-col gap-1 md:gap-2">
      <p className="text-xs leading-normal text-secondary">{detailTitle}</p>
      {detailTitle === "Link" && (
        <a
          href={detailValue}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-secondary decoration-dotted underline-offset-4 block w-fit text-primary hover:text-secondary"
        >
          <span className="group inline text-base">
            <span className="inline">
              {detailValue.match(/^https:\/\/([^/]+)/)?.[1] || detailValue}
            </span>
            <span className="inline-flex whitespace-nowrap">
              <ArrowUpRightIcon className="ml-1 inline-flex aspect-square size-4 align-text-bottom duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </span>
        </a>
      )}
      {detailTitle === "Date" && (
        <p className="text-base leading-normal text-primary">
          {formatDate(new Date(detailValue))}
        </p>
      )}
    </div>
  );
}
