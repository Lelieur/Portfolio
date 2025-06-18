import ThoughtDetailCard from "./ThoughtDetailCard";
import { MediumPost } from "@/types/thoughts";

interface ThoughtsDetailsListProps {
  details: Pick<MediumPost, "date" | "link">;
}

export default function ThoughtsDetailsList({
  details,
}: ThoughtsDetailsListProps) {
  return (
    <section className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
      {Object.entries(details).map(([key, value]) => (
        <ThoughtDetailCard key={key} detail={{ [key]: value.toString() }} />
      ))}
    </section>
  );
}
