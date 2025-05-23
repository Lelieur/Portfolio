import { notFound } from "next/navigation";
import { fetchOneProject } from "@/lib/fetchOneProject";
import { Project } from "@/types/project";
import PageTitle from "@/components/PageTitle";
import ProjectSection from "@/components/ProjectsComponents/ProjectSection";
import ProjectDetailsList from "@/components/ProjectsComponents/ProjectDetailsList";
import Image from "next/image";

interface Params {
  params: { slug: string };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project: Project | null = await fetchOneProject(slug);

  if (!project) return notFound();

  const { title, year, description, details, image, about } = project;

  return (
    <main className="flex flex-col gap-16">
      <article className="flex flex-col gap-16">
        <PageTitle title={title} description={`Published on ${year}`} />
        <ProjectDetailsList details={details} />
        <section className="text-primary [&>p]:leading-relaxed">
          <p className="text-base leading-normal mt-8 text-secondary first:mt-0">
            {description}
          </p>
          <figure className="mt-8 flex flex-col gap-4">
            <Image
              src={image}
              alt={title}
              width="1280"
              height="1600"
              priority
              className="size-full rounded-md border border-primary/15"
            />
            <figcaption className="pb-2 text-xs leading-normal text-secondary">{`Figure 1: ${title}`}</figcaption>
          </figure>
          {about.map((section, index) => (
            <ProjectSection key={index} about={section} />
          ))}
        </section>
      </article>
    </main>
  );
}
