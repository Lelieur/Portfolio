export function formatDate(date: Date): string {
  function getOrdinalSuffix(day: number): string {
    const suffixes = ["th", "st", "nd", "rd"];
    const relevant = day % 100;
    return (
      day +
      (suffixes[(relevant - 20) % 10] || suffixes[relevant] || suffixes[0])
    );
  }

  const day = date.getDate();
  const ordinalDay = getOrdinalSuffix(day); // "29th"
  const month = date.toLocaleString("en-US", { month: "short" }); // "Mar"
  const year = date.getFullYear();

  return `${ordinalDay} of ${month} ${year}`;
}
