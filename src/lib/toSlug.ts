export function toSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(" ")
    .join("-");
}
// This function converts a string to a slug format by:
