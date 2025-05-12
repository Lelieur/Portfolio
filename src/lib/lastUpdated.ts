import { execSync } from "child_process";

function getOrdinalSuffix(day: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const relevant = day % 100;
  return (
    day + (suffixes[(relevant - 20) % 10] || suffixes[relevant] || suffixes[0])
  );
}

export function getLastUpdatedDate(filePath: string): string {
  try {
    const result = execSync(
      `git log -1 --format="%ad" --date=short ${filePath}`
    );
    const isoDate = result.toString().trim(); // e.g., "2025-03-29"

    const date = new Date(isoDate);

    const day = date.getDate();
    const ordinalDay = getOrdinalSuffix(day); // "29th"
    const month = date.toLocaleString("en-US", { month: "short" }); // "Mar"
    const year = date.getFullYear();

    return `${ordinalDay} of ${month} ${year}`;
  } catch (error) {
    console.error("Failed to get last updated date:", error);
    return "";
  }
}
