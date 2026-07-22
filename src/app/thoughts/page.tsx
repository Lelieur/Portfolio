import PageTitle from "@/components/PageTitle";
import ThoughtsList from "@/components/ThougthsComponents/ThoughtsList";
import { getPublishedThoughts } from "@/server/thoughts/queries";

export const dynamic = "force-dynamic";

export default async function Thoughts() {
  const thoughts = await getPublishedThoughts();

  return (
    <main className="ui-main">
      <section className="ui-section">
        <PageTitle
          title="Thoughts"
          description="Personal posts, web development articles, and other topics that interest me."
        />
      </section>
      <section className="ui-section-list">
        <ThoughtsList thougths={thoughts} />
      </section>
    </main>
  );
}
