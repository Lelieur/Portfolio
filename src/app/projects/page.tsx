import PageTitle from "@/components/PageTitle";
import ProjectList from "@/components/ProjectsComponents/ProjectList";
import ProjectsFilterBar from "@/components/ProjectsComponents/ProjectsFilterBar";
import { fetchProjects } from "@/lib/fetchProjects";

export default async function Projects({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const projects = await fetchProjects(searchParams);
  const projectCategories = projects.map((project) => project.details.category);

  return (
    <main className="flex flex-col gap-16">
      <section className="flex flex-col gap-0.5">
        <PageTitle
          title="Projects"
          description="Some of my recent professional work and personal projects."
        />
      </section>
      <section className="flex flex-col gap-8 md:gap-12">
        <ProjectsFilterBar projectCategories={projectCategories} />
        <ProjectList projects={projects} />
      </section>
    </main>
  );
}
