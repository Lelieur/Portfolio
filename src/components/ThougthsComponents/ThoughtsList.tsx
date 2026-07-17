import ThoughtCard from "./ThoughtCard";
import type { Thought } from "@/server/thoughts/types";

interface ThougthsListProps {
  thougths: Thought[];
}

export default async function ThoughtsList({ thougths }: ThougthsListProps) {
  return (
    <div className="flex flex-col gap-6">
      {thougths.map((thougth) => (
        <ThoughtCard key={thougth.slug} {...thougth} />
      ))}
    </div>
  );
}
