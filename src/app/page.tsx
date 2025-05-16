import Hero from '@/components/Hero';
import SocialLinks from '@/components/SocialLinks/SocialLinks';
import HomeSection from '@/components/HomeComponents/HomeSection';
import { thoughts } from '@/data/thoughts';
import { experiments } from '@/data/experiments';
import { fetchProjects } from '@/lib/fetchProjects';

export default async function Home() {
  const projects = await fetchProjects();

  return (
    <main className="flex flex-col gap-16">
      <Hero />
      <SocialLinks />
      <HomeSection title="Projects" link="/projects" items={projects} />
      <HomeSection title="Experiments" link="/experiments" items={experiments} />
      <HomeSection title="Thoughts" link="/thoughts" items={thoughts} />
    </main>
  );
}
