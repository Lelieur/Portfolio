import PageTitle from '@/components/PageTitle';
import ProjectList from '@/components/ProjectsComponents/ProjectList';

export default function Projects() {
  return (
    <main className="flex flex-col gap-16">
      <PageTitle title="Projects" description="What I&#39;ve built" />
      <ProjectList />
    </main>
  );
}
