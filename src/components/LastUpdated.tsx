import { getLastUpdatedDate } from "@/lib/lastUpdated";

export default function LastUpdated() {
  const lastUpdated = getLastUpdatedDate("src/app/about/page.tsx");

  return (
    <span className="flex flex-row items-center gap-1">
      <p className="text-sm leading-normal italic text-secondary">
        * Last Updated on the
      </p>
      <p className="text-sm leading-normal text-secondary">{lastUpdated}</p>
    </span>
  );
}
