export function getUniqueWithCount<T extends string | number>(array: T[]) {
  const counts: Record<T, number> = {} as Record<T, number>;
  array.forEach((item) => {
    counts[item] = (counts[item] || 0) + 1;
  });

  return Object.entries(counts).map(([value, count]) => ({
    value,
    count,
  }));
}
