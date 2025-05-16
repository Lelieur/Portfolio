import { notFound } from 'next/navigation';
import { fetchOneProject } from '@/lib/fetchOneProject';
import { Project } from '@/types/project';
import ProjectDetailsList from '@/components/ProjectsComponents/ProjectDetailsList';
import Image from 'next/image';

interface Params {
  params: { slug: string };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project: Project | null = await fetchOneProject(slug);

  if (!project) return notFound();

  const { title, year, description, details, image } = project;

  return (
    <main className="flex flex-col gap-16">
      <article className="flex flex-col gap-16">
        <section className="flex flex-col gap-0.5">
          <h1 className="text-lg font-medium leading-relaxed text-primary">{title}</h1>
          <p className="text-sm leading-normal text-secondary">Published on {year}</p>
        </section>
        <ProjectDetailsList details={details} />
        <article className="text-primary [&>p]:leading-relaxed">
          <p className="text-base leading-normal mt-8 text-secondary first:mt-0">{description}</p>
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
        </article>
      </article>
    </main>
  );
}
