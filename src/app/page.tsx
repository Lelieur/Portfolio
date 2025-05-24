import Hero from "@/components/Hero";
import SocialLinks from "@/components/SocialLinks/SocialLinks";
import HomeSection from "@/components/HomeComponents/HomeSection";
import { fetchMediumPosts } from "@/lib/fetchMediumPosts";
import { experiments } from "@/data/experiments";
import { fetchProjects } from "@/lib/fetchProjects";

export default async function Home() {
  const projects = await fetchProjects();
  const thoughts = await fetchMediumPosts();

  return (
    <main className="flex flex-col gap-16">
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
