import { execSync } from "child_process";
import { formatDate } from "./formatDate";

export function getLastUpdatedDate(filePath: string): string {
  try {
    const result = execSync(
      `git log -1 --format="%ad" --date=short ${filePath}`
    );
    const isoDate = result.toString().trim(); // e.g., "2025-03-29"

    const date = new Date(isoDate);

    const formattedDate = formatDate(date);

    return `${formattedDate}`;
  } catch (error) {
    console.error("Failed to get last updated date:", error);
    return "";
  }
}
