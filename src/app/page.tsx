import Hero from "@/components/Hero";
import SocialLinks from "@/components/SocialLinks/SocialLinks";
import HomeSection from "@/components/HomeComponents/HomeSection";
import { getFeaturedThoughts } from "@/server/thoughts/queries";
import { experiments } from "@/data/experiments";
import { fetchProjects } from "@/lib/fetchProjects";

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await fetchProjects();
  const thoughts = await getFeaturedThoughts();

  return (
    <main className="ui-main">
      <Hero />
      <SocialLinks />
      <HomeSection section="Projects" link="/projects" items={projects} />
      <HomeSection
        section="Experiments"
        link="/experiments"
        items={experiments}
      />
      <HomeSection
        section="Thoughts"
        link="/thoughts"
        items={thoughts.slice(0, 5)}
      />
    </main>
  );
}
