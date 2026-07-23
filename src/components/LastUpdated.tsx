import { getLastUpdatedDate } from "@/lib/lastUpdated";

export default function LastUpdated() {
  const lastUpdated = getLastUpdatedDate("src/app/about/page.tsx");

  return (
    <span className="ui-updated">
      <p className="ui-text-sm italic">
        * Last Updated on the
      </p>
      <p className="ui-text-sm">{lastUpdated}</p>
    </span>
  );
}
