import ThoughtDetailCard from "./ThoughtDetailCard";

interface ThoughtsDetailsListProps {
  details: { date: string };
}

export default function ThoughtsDetailsList({
  details,
}: ThoughtsDetailsListProps) {
  return (
    <section className="ui-detail-grid">
      {Object.entries(details).map(([key, value]) => (
        <ThoughtDetailCard key={key} detail={{ [key]: value.toString() }} />
      ))}
    </section>
  );
}
