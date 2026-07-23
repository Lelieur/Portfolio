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
    <div className="ui-detail-card">
      <p className="ui-detail-label">{detailTitle}</p>
      {detailTitle === "Link" && (
        <a
          href={detailValue}
          target="_blank"
          rel="noopener noreferrer"
          className="ui-inline-link ui-detail-link"
        >
          <span className="ui-detail-link-content">
            <span>
              {detailValue.match(/^https:\/\/([^/]+)/)?.[1] || detailValue}
            </span>
            <span className="ui-external-link-icon">
              <ArrowUpRightIcon />
            </span>
          </span>
        </a>
      )}
      {detailTitle === "Date" && (
        <p className="ui-detail-value">
          {formatDate(new Date(detailValue))}
        </p>
      )}
    </div>
  );
}
