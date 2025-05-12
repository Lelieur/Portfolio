import Hero from "@/components/Hero";
import SocialLinks from "@/components/SocialLinks/SocialLinks";
import HomeSection from "@/components/HomeSection";
import { thoughts } from "@/data/thoughts";
import { projects } from "@/data/projects";
import { experiments } from "@/data/experiments";

export default function Home() {
  return (
    <main className="flex flex-col gap-16">
      <Hero />
      <SocialLinks />
      <HomeSection title="Projects" link="/projects" items={projects} />
      <HomeSection
        title="Experiments"
        link="/experiments"
        items={experiments}
      />
      <HomeSection title="Thoughts" link="/thoughts" items={thoughts} />
    </main>
  );
}
