import ThoughtCard from "./ThoughtCard";
import type { Thought } from "@/server/thoughts/types";

interface ThougthsListProps {
  thougths: Thought[];
}

export default async function ThoughtsList({ thougths }: ThougthsListProps) {
  return (
    <div className="ui-content-list">
      {thougths.map((thougth) => (
        <ThoughtCard key={thougth.slug} {...thougth} />
      ))}
    </div>
  );
}
