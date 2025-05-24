import ThougthCard from "./ThougthCard";
import { MediumPost } from "@/types/thougths";

interface ThougthsListProps {
  thougths: MediumPost[];
}

export default async function ThougthsList({ thougths }: ThougthsListProps) {
  return (
    <div className="flex flex-col gap-6">
      {thougths.map((thougth) => (
        <ThougthCard key={thougth.slug} {...thougth} />
      ))}
    </div>
  );
}
