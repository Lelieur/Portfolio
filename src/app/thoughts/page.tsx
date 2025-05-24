import PageTitle from "@/components/PageTitle";
import ThougthsList from "@/components/ThougthsComponents/ThougthsList";
import { fetchMediumPosts } from "@/lib/fetchMediumPosts";

export default async function Thoughts() {
  const thoughts = await fetchMediumPosts();

  return (
    <main className="flex flex-col gap-16">
      <section className="flex flex-col gap-0.5">
        <PageTitle
          title="Thoughts"
          description="Personal posts, web development articles, and other topics that interest me."
        />
      </section>
      <section className="flex flex-col gap-8 md:gap-12">
        <ThougthsList thougths={thoughts} />
      </section>
    </main>
  );
}
