import PageTitle from "@/components/PageTitle";
import ProjectList from "@/components/ProjectsComponents/ProjectList";
import { fetchProjects } from "@/lib/fetchProjects";

export default async function Projects() {
  const projects = await fetchProjects();
  return (
    <main className="flex flex-col gap-16">
      <PageTitle
        title="Projects"
        description="Some of my recent professional work and personal projects."
      />
      <ProjectList projects={projects} />
    </main>
  );
}
