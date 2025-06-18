import ThoughtCard from "./ThoughtCard";
import { MediumPost } from "@/types/thoughts";

interface ThougthsListProps {
  thougths: MediumPost[];
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
