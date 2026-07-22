import { notFound } from "next/navigation";
import { fetchOneProject } from "@/lib/fetchOneProject";
import { Project } from "@/types/project";
import PageTitle from "@/components/PageTitle";
import ProjectSection from "@/components/ProjectsComponents/ProjectSection";
import ProjectDetailsList from "@/components/ProjectsComponents/ProjectDetailsList";
import Image from "next/image";

export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project: Project | null = await fetchOneProject(slug);

  if (!project) return notFound();

  const { title, year, description, details, image, about } = project;

  return (
    <main className="ui-detail-page">
      <article className="ui-detail-article">
        <PageTitle title={title} description={`Published on ${year}`} />
        <ProjectDetailsList details={details} />
        <section className="ui-detail-copy">
          <p className="ui-detail-description">
            {description}
          </p>
          <figure className="ui-detail-figure">
            <Image
              src={image}
              alt={title}
              width="1280"
              height="1600"
              priority
              className="ui-detail-image"
            />
            <figcaption className="ui-detail-caption">{`Figure 1: ${title}`}</figcaption>
          </figure>
          {about.map((section, index) => (
            <ProjectSection key={index} about={section} />
          ))}
        </section>
      </article>
    </main>
  );
}
